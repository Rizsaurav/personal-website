// src/pages/blogs/BlogComponents.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MessageCircle, Send, Trash2, Reply,
  Heart, ThumbsUp, Lightbulb, Star
} from "lucide-react";
import "./blogs.css";

import {
  collection, addDoc, onSnapshot, query, orderBy,
  serverTimestamp, updateDoc, doc, deleteDoc
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

/* ---------------- Utilities you already had ---------------- */
export function parseFrontMatter(content) {
  const match = /^---\n([\s\S]+?)\n---/.exec(content);
  if (!match) return { attributes: {}, body: content };
  const attributes = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    attributes[key.trim()] = rest.join(":").trim();
  });
  const body = content.slice(match[0].length);
  return { attributes, body };
}

export function estimateReadTime(content) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

/* ---------------- Firestore helpers ---------------- */
const colFor = (slug) => collection(db, "posts", slug, "comments");

async function ensureAnon() {
  if (auth.currentUser) return auth.currentUser;
  const cred = await signInAnonymously(auth);
  return cred.user;
}

/* ---------------- Reactions ---------------- */
function ReactionButton({ icon: Icon, field, comment, slug }) {
  const uid = auth.currentUser?.uid;
  const reacted = comment.userReactions?.[uid] === field;

  const toggle = async () => {
    if (!uid) {
      await ensureAnon();
    }
    const ref = doc(db, "posts", slug, "comments", comment.id);
    const current = comment.userReactions || {};
    const next = { ...current };
    if (reacted) delete next[auth.currentUser.uid];
    else next[auth.currentUser.uid] = field;
    await updateDoc(ref, { userReactions: next });
  };

  const count = Object.values(comment.userReactions || {}).filter((v) => v === field).length;

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs md:text-sm
        ${reacted ? "bg-opacity-30" : "bg-opacity-10"}
        ${field === "heart" ? "bg-red-100 border-red-300 text-red-800"
          : field === "thumb" ? "bg-blue-100 border-blue-300 text-blue-800"
          : field === "lightbulb" ? "bg-yellow-100 border-yellow-300 text-yellow-800"
          : "bg-green-100 border-green-300 text-green-800"}`}
      title={field}
    >
      <Icon className={`w-4 h-4 ${reacted ? "fill-current" : ""}`} />
      <span>{count}</span>
    </button>
  );
}

/* ---------------- Single comment (recursive) ---------------- */
function CommentNode({ node, slug }) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const canDelete = auth.currentUser?.uid === node.uid;

  const postReply = async () => {
    if (!reply.trim()) return;
    await ensureAnon();
    await addDoc(colFor(slug), {
      author: auth.currentUser?.displayName || "Guest",
      avatar: auth.currentUser?.photoURL || "https://via.placeholder.com/40",
      uid: auth.currentUser?.uid || null,
      content: reply.trim(),
      parentId: node.id,                 // link to parent
      timestamp: serverTimestamp(),
      userReactions: {},
    });
    setReply("");
    setShowReply(false);
  };

  const del = async () => {
    if (!canDelete) return;
    await deleteDoc(doc(db, "posts", slug, "comments", node.id));
    // Children remain (like most apps) — optional recursive delete can be done via Cloud Function.
  };

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <img
          src={node.avatar}
          alt={node.author}
          className="w-10 h-10 rounded-full object-cover ring-2"
        />
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm">{node.author}</h4>
              {canDelete && (
                <button onClick={del} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full" title="Delete">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{node.content}</p>
          </div>

          <div className="flex items-center flex-wrap gap-2 mt-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              {node.timestamp?.toDate
                ? node.timestamp.toDate().toLocaleString()
                : "Just now"}
            </span>

            <ReactionButton icon={Heart} field="heart" comment={node} slug={slug} />
            <ReactionButton icon={ThumbsUp} field="thumb" comment={node} slug={slug} />
            <ReactionButton icon={Lightbulb} field="lightbulb" comment={node} slug={slug} />
            <ReactionButton icon={Star} field="star" comment={node} slug={slug} />

            <button
              onClick={() => setShowReply((s) => !s)}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
          </div>

          {showReply && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 p-2 border rounded-lg text-sm"
              />
              <button onClick={postReply} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                Reply
              </button>
            </div>
          )}

          {/* children */}
          {node.children?.length > 0 && (
            <div className="mt-3 ml-6 border-l pl-4 space-y-4">
              {node.children.map((child) => (
                <CommentNode key={child.id} node={child} slug={slug} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Section (build tree + composer) ---------------- */
export function CommentSection() {
  const { slug } = useParams();
  const [all, setAll] = useState([]);        // all flat comments for this slug
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  // auth state (anonymous is fine)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  // single listener → no composite indexes needed
  useEffect(() => {
    if (!slug) return;
    const q = query(colFor(slug), orderBy("timestamp", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAll(data);
      },
      (err) => {
        console.error("Comments listener error:", err);
      }
    );
    return () => unsub();
  }, [slug]);

  // build thread tree client-side
  const roots = useMemo(() => {
    const byParent = new Map(); // parentId -> children[]
    const byId = new Map();
    all.forEach((c) => {
      byId.set(c.id, { ...c, children: [] });
    });
    byId.forEach((c) => {
      const p = c.parentId ?? null; // null and undefined treated as root
      if (!byParent.has(p)) byParent.set(p, []);
      byParent.get(p).push(c);
    });
    // attach children arrays
    byId.forEach((c) => {
      c.children = byParent.get(c.id) || [];
    });
    return byParent.get(null) || byParent.get(undefined) || [];
  }, [all]);

  const submit = async (e) => {
    e.preventDefault();
    if (!slug || !text.trim()) return;
    await ensureAnon();
    await addDoc(colFor(slug), {
      author: auth.currentUser?.displayName || "Guest",
      avatar: auth.currentUser?.photoURL || "https://via.placeholder.com/40",
      uid: auth.currentUser?.uid || null,
      content: text.trim(),
      parentId: null,                        // root
      timestamp: serverTimestamp(),
      userReactions: {},
    });
    setText("");
  };

  return (
    <div className="mt-16 pt-8 border-t">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Comments ({roots.length})</h3>
      </div>

      {/* composer */}
      <form onSubmit={submit} className="mb-8">
        <div className="flex gap-3">
          <img
            src={user?.photoURL || "https://via.placeholder.com/40"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover ring-2"
          />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border rounded-2xl"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3 gap-2">
              <div className="text-xs text-gray-400">{text.length}/500 characters</div>
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-1 px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full text-sm"
              >
                <Send className="w-4 h-4" /> Post
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* threads */}
      <div className="space-y-6">
        {roots.map((node) => (
          <CommentNode key={node.id} node={node} slug={slug} />
        ))}
      </div>
    </div>
  );
}
