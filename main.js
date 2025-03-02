/*! For license information please see out.js.LICENSE.txt */
https://flamepass.com/

/*! Copyright (C) 2025 flamepass.com; All rights reserved. !*/
"use strict";
(() => {
  function e() {
    try {
      return "object" == typeof indexedDB;
    } catch (e) {
      return false;
    }
  }
  function t() {
    return new Promise((e, t) => {
      try {
        let n = true;
        const o = self.indexedDB.open("validate-browser-context-for-indexeddb-analytics-module");
        o.onsuccess = () => {
          o.result.close();
          if (!n) {
            self.indexedDB.deleteDatabase("validate-browser-context-for-indexeddb-analytics-module");
          }
          e(true);
        };
        o.onupgradeneeded = () => {
          n = false;
        };
        o.onerror = () => {
          var e;
          t((null === (e = o.error) || undefined === e ? undefined : e.message) || "");
        };
      } catch (e) {
        t(e);
      }
    });
  }
  function n(e, t) {
    if (e === t) {
      return true;
    }
    const o = Object.keys(e);
    const a = Object.keys(t);
    for (const i of o) {
      if (!a.includes(i)) {
        return false;
      }
      const o = e[i];
      const s = t[i];
      if (null !== o && "object" == typeof o && null !== s && "object" == typeof s) {
        if (!n(o, s)) {
          return false;
        }
      } else if (o !== s) {
        return false;
      }
    }
    for (const e of a) if (!o.includes(e)) {
      return false;
    }
    return true;
  }
  function r(e) {
    return null !== e && "object" == typeof e;
  }
  function o(e, t = 1e3, n = 2) {
    const r = t * Math.pow(n, e);
    const o = Math.round(.5 * r * (Math.random() - .5) * 2);
    return Math.min(144e5, r + o);
  }
  function a(e) {
    return e && e._delegate ? e._delegate : e;
  }
  function i(e) {
    return e !== IDBDatabase.prototype.transaction || "objectStoreNames" in IDBTransaction.prototype ? (Dt || (Dt = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])).includes(e) ? function (...t) {
      e.apply(Ht.get(this), t);
      return c(Ft.get(this));
    } : function (...t) {
      return c(e.apply(Ht.get(this), t));
    } : function (t, ...n) {
      const r = e.call(Ht.get(this), t, ...n);
      Bt.set(r, t.sort ? t.sort() : [t]);
      return c(r);
    };
  }
  function s(e) {
    return "function" == typeof e ? i(e) : (e instanceof IDBTransaction && function (e) {
      if (Nt.has(e)) {
        return;
      }
      const t = new Promise((t, n) => {
        const r = () => {
          e.removeEventListener("complete", o);
          e.removeEventListener("error", a);
          e.removeEventListener("abort", a);
        };
        const o = () => {
          t();
          r();
        };
        const a = () => {
          n(e.error || new DOMException("AbortError", "AbortError"));
          r();
        };
        e.addEventListener("complete", o);
        e.addEventListener("error", a);
        e.addEventListener("abort", a);
      });
      Nt.set(e, t);
    }(e), t = e, (Pt || (Pt = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])).some(e => t instanceof e) ? new Proxy(e, Rt) : e);
    var t;
  }
  function c(e) {
    if (e instanceof IDBRequest) {
      return function (e) {
        const t = new Promise((t, n) => {
          const r = () => {
            e.removeEventListener("success", o);
            e.removeEventListener("error", a);
          };
          const o = () => {
            t(c(e.result));
            r();
          };
          const a = () => {
            n(e.error);
            r();
          };
          e.addEventListener("success", o);
          e.addEventListener("error", a);
        });
        t.then(t => {
          if (t instanceof IDBCursor) {
            Ft.set(t, e);
          }
        }).catch(() => {});
        Ht.set(t, e);
        return t;
      }(e);
    }
    if (Ut.has(e)) {
      return Ut.get(e);
    }
    const t = s(e);
    if (t !== e) {
      Ut.set(e, t);
      Ht.set(t, e);
    }
    return t;
  }
  function l(e, t, {
    blocked: n,
    upgrade: r,
    blocking: o,
    terminated: a
  } = {}) {
    const i = indexedDB.open(e, t);
    const s = c(i);
    if (r) {
      i.addEventListener("upgradeneeded", e => {
        r(c(i.result), e.oldVersion, e.newVersion, c(i.transaction), e);
      });
    }
    if (n) {
      i.addEventListener("blocked", e => n(e.oldVersion, e.newVersion, e));
    }
    s.then(e => {
      if (a) {
        e.addEventListener("close", () => a());
      }
      if (o) {
        e.addEventListener("versionchange", e => o(e.oldVersion, e.newVersion, e));
      }
    }).catch(() => {});
    return s;
  }
  function d(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) {
      return;
    }
    if (Vt.get(t)) {
      return Vt.get(t);
    }
    const n = t.replace(/FromIndex$/, "");
    const r = t !== n;
    const o = qt.includes(n);
    if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !o && !Wt.includes(n)) {
      return;
    }
    const a = async function (e, ...t) {
      const a = this.transaction(e, o ? "readwrite" : "readonly");
      let i = a.store;
      if (r) {
        i = i.index(t.shift());
      }
      return (await Promise.all([i[n](...t), o && a.done]))[0];
    };
    Vt.set(t, a);
    return a;
  }
  function u(e, t) {
    try {
      e.container.addComponent(t);
    } catch (n) {
      Zt.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`, n);
    }
  }
  function h(e) {
    const t = e.name;
    if (Ln.has(t)) {
      Zt.debug(`There were multiple attempts to register component ${t}.`);
      return false;
    }
    Ln.set(t, e);
    for (const t of xn.values()) u(t, e);
    for (const t of Sn.values()) u(t, e);
    return true;
  }
  function p(e, t) {
    const n = e.container.getProvider("heartbeat").getImmediate({
      optional: true
    });
    if (n) {
      n.triggerHeartbeat();
    }
    return e.container.getProvider(t);
  }
  function f(e, t = {}) {
    let r = e;
    if ("object" != typeof t) {
      t = {
        name: t
      };
    }
    const o = Object.assign({
      name: "[DEFAULT]",
      automaticDataCollectionEnabled: false
    }, t);
    const a = o.name;
    if ("string" != typeof a || !a) {
      throw In.create("bad-app-name", {
        appName: a + ""
      });
    }
    if (!r) {
      r = yt();
    }
    if (!r) {
      throw In.create("no-options");
    }
    const i = xn.get(a);
    if (i) {
      if (n(r, i.options) && n(o, i.config)) {
        return i;
      }
      throw In.create("duplicate-app", {
        appName: a
      });
    }
    const s = new xt(a);
    for (const e of Ln.values()) s.addComponent(e);
    const c = new jn(r, o, s);
    xn.set(a, c);
    return c;
  }
  function m(e, t, n) {
    var r;
    let o = null !== (r = Tn[e]) && undefined !== r ? r : e;
    if (n) {
      o += "-" + n;
    }
    const a = o.match(/\s|\//);
    const i = t.match(/\s|\//);
    if (a || i) {
      const e = [`Unable to register library "${o}" with version "${t}":`];
      if (a) {
        e.push(`library name "${o}" contains illegal characters (whitespace or "/")`);
      }
      if (a && i) {
        e.push("and");
      }
      if (i) {
        e.push(`version name "${t}" contains illegal characters (whitespace or "/")`);
      }
      return void Zt.warn(e.join(" "));
    }
    h(new Et(o + "-version", () => ({
      library: o,
      version: t
    }), "VERSION"));
  }
  function g() {
    if (!_n) {
      _n = l("firebase-heartbeat-database", 1, {
        upgrade: (e, t) => {
          if (0 === t) {
            try {
              e.createObjectStore("firebase-heartbeat-store");
            } catch (e) {}
          }
        }
      }).catch(e => {
        throw In.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return _n;
  }
  async function b(e, t) {
    try {
      const n = (await g()).transaction("firebase-heartbeat-store", "readwrite");
      const r = n.objectStore("firebase-heartbeat-store");
      await r.put(t, `${e.name}!${e.options.appId}`);
      await n.done;
    } catch (e) {
      if (e instanceof wt) {
        Zt.warn(e.message);
      } else {
        const t = In.create("idb-set", {
          originalErrorMessage: null == e ? undefined : e.message
        });
        Zt.warn(t.message);
      }
    }
  }
  function y(e) {
    return `${e.name}!${e.options.appId}`;
  }
  function v() {
    return new Date().toISOString().substring(0, 10);
  }
  function w(e) {
    return ft(JSON.stringify({
      version: 2,
      heartbeats: e
    })).length;
  }
  function k(e) {
    return e instanceof wt && e.code.includes("request-failed");
  }
  function C({
    projectId: e
  }) {
    return `https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`;
  }
  function E(e) {
    t = e.expiresIn;
    return {
      token: e.token,
      requestStatus: 2,
      expiresIn: Number(t.replace("s", "000")),
      creationTime: Date.now()
    };
    var t;
  }
  async function A(e, t) {
    const n = (await t.json()).error;
    return Rn.create("request-failed", {
      requestName: e,
      serverCode: n.code,
      serverMessage: n.message,
      serverStatus: n.status
    });
  }
  function T({
    apiKey: e
  }) {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": e
    });
  }
  function x(e, {
    refreshToken: t
  }) {
    const n = T(e);
    n.append("Authorization", function (e) {
      return `${"FIS_v2"} ${e}`;
    }(t));
    return n;
  }
  async function S(e) {
    const t = await e();
    return t.status >= 500 && t.status < 600 ? e() : t;
  }
  function L(e) {
    return new Promise(t => {
      setTimeout(t, e);
    });
  }
  function I() {
    try {
      const e = new Uint8Array(17);
      (self.crypto || self.msCrypto).getRandomValues(e);
      e[0] = 112 + e[0] % 16;
      const t = function (e) {
        const t = btoa(String.fromCharCode(...e)).replace(/\+/g, "-").replace(/\//g, "_");
        return t.substr(0, 22);
      }(e);
      return zn.test(t) ? t : "";
    } catch (e) {
      return "";
    }
  }
  function j(e) {
    return `${e.appName}!${e.appId}`;
  }
  function M(e, t) {
    const n = `${e.appName}!${e.appId}`;
    _(n, t);
    (function (e, t) {
      const n = O();
      if (n) {
        n.postMessage({
          key: e,
          fid: t
        });
      }
      P();
    })(n, t);
  }
  function _(e, t) {
    const n = Wn.get(e);
    if (n) {
      for (const e of n) e(t);
    }
  }
  function O() {
    if (!qn && "BroadcastChannel" in self) {
      qn = new BroadcastChannel("[Firebase] FID Change");
      qn.onmessage = e => {
        _(e.data.key, e.data.fid);
      };
    }
    return qn;
  }
  function P() {
    if (0 === Wn.size && qn) {
      qn.close();
      qn = null;
    }
  }
  function D() {
    if (!Gn) {
      Gn = l("firebase-installations-database", 1, {
        upgrade: (e, t) => {
          if (0 === t) {
            e.createObjectStore("firebase-installations-store");
          }
        }
      });
    }
    return Gn;
  }
  async function F(e, t) {
    const n = `${e.appName}!${e.appId}`;
    const r = (await D()).transaction("firebase-installations-store", "readwrite");
    const o = r.objectStore("firebase-installations-store");
    const a = await o.get(n);
    await o.put(t, n);
    await r.done;
    if (!(a && a.fid === t.fid)) {
      M(e, t.fid);
    }
    return t;
  }
  async function N(e) {
    const t = `${e.appName}!${e.appId}`;
    const n = (await D()).transaction("firebase-installations-store", "readwrite");
    await n.objectStore("firebase-installations-store").delete(t);
    await n.done;
  }
  async function B(e, t) {
    const n = `${e.appName}!${e.appId}`;
    const r = (await D()).transaction("firebase-installations-store", "readwrite");
    const o = r.objectStore("firebase-installations-store");
    const a = await o.get(n);
    const i = t(a);
    if (undefined === i) {
      await o.delete(n);
    } else {
      await o.put(i, n);
    }
    await r.done;
    if (!(!i || a && a.fid === i.fid)) {
      M(e, i.fid);
    }
    return i;
  }
  async function U(e) {
    let t;
    const n = await B(e.appConfig, n => {
      const r = function (e) {
        const t = e || {
          fid: I(),
          registrationStatus: 0
        };
        return z(t);
      }(n);
      const o = function (e, t) {
        if (0 === t.registrationStatus) {
          if (!navigator.onLine) {
            return {
              installationEntry: t,
              registrationPromise: Promise.reject(Rn.create("app-offline"))
            };
          }
          const n = {
            fid: t.fid,
            registrationStatus: 1,
            registrationTime: Date.now()
          };
          const r = async function (e, t) {
            try {
              const n = await async function ({
                appConfig: e,
                heartbeatServiceProvider: t
              }, {
                fid: n
              }) {
                const r = C(e);
                const o = T(e);
                const a = t.getImmediate({
                  optional: true
                });
                if (a) {
                  const e = await a.getHeartbeatsHeader();
                  if (e) {
                    o.append("x-firebase-client", e);
                  }
                }
                const i = {
                  fid: n,
                  authVersion: "FIS_v2",
                  appId: e.appId,
                  sdkVersion: Un
                };
                const s = {
                  method: "POST",
                  headers: o,
                  body: JSON.stringify(i)
                };
                const c = await S(() => fetch(r, s));
                if (c.ok) {
                  const e = await c.json();
                  return {
                    fid: e.fid || n,
                    registrationStatus: 2,
                    refreshToken: e.refreshToken,
                    authToken: E(e.authToken)
                  };
                }
                throw await A("Create Installation", c);
              }(e, t);
              return F(e.appConfig, n);
            } catch (n) {
              if (n instanceof wt && n.code.includes("request-failed") && 409 === n.customData.serverCode) {
                await N(e.appConfig);
              } else {
                await F(e.appConfig, {
                  fid: t.fid,
                  registrationStatus: 0
                });
              }
              throw n;
            }
          }(e, n);
          return {
            installationEntry: n,
            registrationPromise: r
          };
        }
        return 1 === t.registrationStatus ? {
          installationEntry: t,
          registrationPromise: H(e)
        } : {
          installationEntry: t
        };
      }(e, r);
      t = o.registrationPromise;
      return o.installationEntry;
    });
    return "" === n.fid ? {
      installationEntry: await t
    } : {
      installationEntry: n,
      registrationPromise: t
    };
  }
  async function H(e) {
    let t = await R(e.appConfig);
    for (; 1 === t.registrationStatus;) {
      await L(100);
      t = await R(e.appConfig);
    }
    if (0 === t.registrationStatus) {
      const {
        installationEntry: t,
        registrationPromise: n
      } = await U(e);
      return n || t;
    }
    return t;
  }
  function R(e) {
    return B(e, e => {
      if (!e) {
        throw Rn.create("installation-not-found");
      }
      return z(e);
    });
  }
  function z(e) {
    return 1 === (t = e).registrationStatus && t.registrationTime + 1e4 < Date.now() ? {
      fid: e.fid,
      registrationStatus: 0
    } : e;
    var t;
  }
  async function W({
    appConfig: e,
    heartbeatServiceProvider: t
  }, n) {
    const r = function (e, {
      fid: t
    }) {
      return `${C(e)}/${t}/authTokens:generate`;
    }(e, n);
    const o = x(e, n);
    const a = t.getImmediate({
      optional: true
    });
    if (a) {
      const e = await a.getHeartbeatsHeader();
      if (e) {
        o.append("x-firebase-client", e);
      }
    }
    const i = {
      installation: {
        sdkVersion: Un,
        appId: e.appId
      }
    };
    const s = {
      method: "POST",
      headers: o,
      body: JSON.stringify(i)
    };
    const c = await S(() => fetch(r, s));
    if (c.ok) {
      return E(await c.json());
    }
    throw await A("Generate Auth Token", c);
  }
  async function q(e, t = false) {
    let n;
    const r = await B(e.appConfig, r => {
      if (!(undefined !== r && 2 === r.registrationStatus)) {
        throw Rn.create("not-registered");
      }
      const o = r.authToken;
      if (!t && function (e) {
        return 2 === e.requestStatus && !function (e) {
          const t = Date.now();
          return t < e.creationTime || e.creationTime + e.expiresIn < t + 36e5;
        }(e);
      }(o)) {
        return r;
      }
      if (1 === o.requestStatus) {
        n = async function (e, t) {
          let n = await V(e.appConfig);
          for (; 1 === n.authToken.requestStatus;) {
            await L(100);
            n = await V(e.appConfig);
          }
          const r = n.authToken;
          return 0 === r.requestStatus ? q(e, t) : r;
        }(e, t);
        return r;
      }
      {
        if (!navigator.onLine) {
          throw Rn.create("app-offline");
        }
        const t = function (e) {
          const t = {
            requestStatus: 1,
            requestTime: Date.now()
          };
          return Object.assign(Object.assign({}, e), {
            authToken: t
          });
        }(r);
        n = async function (e, t) {
          try {
            const n = await W(e, t);
            const r = Object.assign(Object.assign({}, t), {
              authToken: n
            });
            await F(e.appConfig, r);
            return n;
          } catch (n) {
            if (!(n instanceof wt && n.code.includes("request-failed")) || 401 !== n.customData.serverCode && 404 !== n.customData.serverCode) {
              const n = Object.assign(Object.assign({}, t), {
                authToken: {
                  requestStatus: 0
                }
              });
              await F(e.appConfig, n);
            } else {
              await N(e.appConfig);
            }
            throw n;
          }
        }(e, t);
        return t;
      }
    });
    return n ? await n : r.authToken;
  }
  function V(e) {
    return B(e, e => {
      if (!(undefined !== e && 2 === e.registrationStatus)) {
        throw Rn.create("not-registered");
      }
      const t = e.authToken;
      return 1 === (n = t).requestStatus && n.requestTime + 1e4 < Date.now() ? Object.assign(Object.assign({}, e), {
        authToken: {
          requestStatus: 0
        }
      }) : e;
      var n;
    });
  }
  function G(e) {
    return undefined !== e && 2 === e.registrationStatus;
  }
  async function J(e, t = false) {
    await async function (e) {
      const {
        registrationPromise: t
      } = await U(e);
      if (t) {
        await t;
      }
    }(e);
    return (await q(e, t)).token;
  }
  function X(e) {
    return Rn.create("missing-app-config-values", {
      valueName: e
    });
  }
  function K(e) {
    if (!e.startsWith("https://www.googletagmanager.com/gtag/js")) {
      const t = Qn.create("invalid-gtag-resource", {
        gtagURL: e
      });
      Yn.warn(t.message);
      return "";
    }
    return e;
  }
  function Z(e) {
    return Promise.all(e.map(e => e.catch(e => e)));
  }
  function Y(e, t) {
    const n = function (e, t) {
      let n;
      if (window.trustedTypes) {
        n = window.trustedTypes.createPolicy(e, t);
      }
      return n;
    }("firebase-js-sdk-policy", {
      createScriptURL: K
    });
    const r = document.createElement("script");
    r.src = n ? null == n ? undefined : n.createScriptURL(`${Zn}?l=${e}&id=${t}`) : `${Zn}?l=${e}&id=${t}`;
    r.async = true;
    document.head.appendChild(r);
  }
  function Q(e, t, n, r) {
    return async function (o, ...a) {
      try {
        if ("event" === o) {
          const [r, o] = a;
          await async function (e, t, n, r, o) {
            try {
              let a = [];
              if (o && o.send_to) {
                let e = o.send_to;
                if (!Array.isArray(e)) {
                  e = [e];
                }
                const r = await Z(n);
                for (const n of e) {
                  const e = r.find(e => e.measurementId === n);
                  const o = e && t[e.appId];
                  if (!o) {
                    a = [];
                    break;
                  }
                  a.push(o);
                }
              }
              if (0 === a.length) {
                a = Object.values(t);
              }
              await Promise.all(a);
              e("event", r, o || {});
            } catch (e) {
              Yn.error(e);
            }
          }(e, t, n, r, o);
        } else if ("config" === o) {
          const [o, i] = a;
          await async function (e, t, n, r, o, a) {
            const i = r[o];
            try {
              if (i) {
                await t[i];
              } else {
                const e = (await Z(n)).find(e => e.measurementId === o);
                if (e) {
                  await t[e.appId];
                }
              }
            } catch (e) {
              Yn.error(e);
            }
            e("config", o, a);
          }(e, t, n, r, o, i);
        } else if ("consent" === o) {
          const [t, n] = a;
          e("consent", t, n);
        } else if ("get" === o) {
          const [t, n, r] = a;
          e("get", t, n, r);
        } else if ("set" === o) {
          const [t] = a;
          e("set", t);
        } else {
          e(o, ...a);
        }
      } catch (e) {
        Yn.error(e);
      }
    };
  }
  function $(e) {
    return new Headers({
      Accept: "application/json",
      "x-goog-api-key": e
    });
  }
  async function ee(e, t = $n, n) {
    const {
      appId: r,
      apiKey: o,
      measurementId: a
    } = e.options;
    if (!r) {
      throw Qn.create("no-app-id");
    }
    if (!o) {
      if (a) {
        return {
          measurementId: a,
          appId: r
        };
      }
      throw Qn.create("no-api-key");
    }
    const i = t.getThrottleMetadata(r) || {
      backoffCount: 0,
      throttleEndTimeMillis: Date.now()
    };
    const s = new er();
    setTimeout(async () => {
      s.abort();
    }, undefined !== n ? n : 6e4);
    return te({
      appId: r,
      apiKey: o,
      measurementId: a
    }, i, s, t);
  }
  async function te(e, {
    throttleEndTimeMillis: t,
    backoffCount: n
  }, r, a = $n) {
    var i;
    const {
      appId: s,
      measurementId: c
    } = e;
    try {
      await function (e, t) {
        return new Promise((n, r) => {
          const o = Math.max(t - Date.now(), 0);
          const a = setTimeout(n, o);
          e.addEventListener(() => {
            clearTimeout(a);
            r(Qn.create("fetch-throttle", {
              throttleEndTimeMillis: t
            }));
          });
        });
      }(r, t);
    } catch (e) {
      if (c) {
        Yn.warn("Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID " + c + ` provided in the "measurementId" field in the local Firebase config. [${null == e ? undefined : e.message}]`);
        return {
          appId: s,
          measurementId: c
        };
      }
      throw e;
    }
    try {
      const t = await async function (e) {
        var t;
        const {
          appId: n,
          apiKey: r
        } = e;
        const o = {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
            "x-goog-api-key": r
          })
        };
        const a = "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace("{app-id}", n);
        const i = await fetch(a, o);
        if (200 !== i.status && 304 !== i.status) {
          let e = "";
          try {
            const n = await i.json();
            if (null === (t = n.error) || undefined === t ? undefined : t.message) {
              e = n.error.message;
            }
          } catch (e) {}
          throw Qn.create("config-fetch-failed", {
            httpStatus: i.status,
            responseMessage: e
          });
        }
        return i.json();
      }(e);
      a.deleteThrottleMetadata(s);
      return t;
    } catch (t) {
      if (!function (e) {
        if (!(e instanceof wt && e.customData)) {
          return false;
        }
        const t = Number(e.customData.httpStatus);
        return 429 === t || 500 === t || 503 === t || 504 === t;
      }(t)) {
        a.deleteThrottleMetadata(s);
        if (c) {
          Yn.warn("Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID " + c + ` provided in the "measurementId" field in the local Firebase config. [${null == t ? undefined : t.message}]`);
          return {
            appId: s,
            measurementId: c
          };
        }
        throw t;
      }
      const d = 503 === Number(null === (i = null == t ? undefined : t.customData) || undefined === i ? undefined : i.httpStatus) ? o(n, a.intervalMillis, 30) : o(n, a.intervalMillis);
      const u = {
        throttleEndTimeMillis: Date.now() + d,
        backoffCount: n + 1
      };
      a.setThrottleMetadata(s, u);
      Yn.debug(`Calling attemptFetch again in ${d} millis`);
      return te(e, u, r, a);
    }
  }
  function ne(e) {
    nr = e;
  }
  function re(e) {
    tr = e;
  }
  async function oe(n, r, o, a, i, s, c) {
    var l;
    const d = ee(n);
    d.then(e => {
      o[e.measurementId] = e.appId;
      if (n.options.measurementId && e.measurementId !== n.options.measurementId) {
        Yn.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${e.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`);
      }
    }).catch(e => Yn.error(e));
    r.push(d);
    const u = async function () {
      if (!e()) {
        Yn.warn(Qn.create("indexeddb-unavailable", {
          errorInfo: "IndexedDB is not available in this environment."
        }).message);
        return false;
      }
      try {
        await t();
      } catch (e) {
        Yn.warn(Qn.create("indexeddb-unavailable", {
          errorInfo: null == e ? undefined : e.toString()
        }).message);
        return false;
      }
      return true;
    }().then(e => e ? a.getId() : undefined);
    const [h, p] = await Promise.all([d, u]);
    if (!function (e) {
      const t = window.document.getElementsByTagName("script");
      for (const n of Object.values(t)) if (n.src && n.src.includes("https://www.googletagmanager.com/gtag/js") && n.src.includes(e)) {
        return n;
      }
      return null;
    }(s)) {
      Y(s, h.measurementId);
    }
    if (nr) {
      i("consent", "default", nr);
      ne(undefined);
    }
    i("js", new Date());
    const f = null !== (l = null == c ? undefined : c.config) && undefined !== l ? l : {};
    f.origin = "firebase";
    f.update = true;
    if (null != p) {
      f.firebase_id = p;
    }
    i("config", h.measurementId, f);
    if (tr) {
      i("set", tr);
      re(undefined);
    }
    return h.measurementId;
  }
  function ae() {
    const e = [];
    if (function () {
      const e = "object" == typeof chrome ? chrome.runtime : "object" == typeof browser ? browser.runtime : undefined;
      return "object" == typeof e && undefined !== e.id;
    }()) {
      e.push("This is a browser extension environment.");
    }
    if (!("undefined" != typeof navigator && navigator.cookieEnabled)) {
      e.push("Cookies are not available.");
    }
    if (e.length > 0) {
      const t = e.map((e, t) => `(${t + 1}) ${e}`).join(" ");
      const n = Qn.create("invalid-analytics-context", {
        errorInfo: t
      });
      Yn.warn(n.message);
    }
  }
  function ie(e, t, n) {
    ae();
    const r = e.options.appId;
    if (!r) {
      throw Qn.create("no-app-id");
    }
    if (!e.options.apiKey) {
      if (!e.options.measurementId) {
        throw Qn.create("no-api-key");
      }
      Yn.warn('The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ' + e.options.measurementId + ' provided in the "measurementId" field in the local Firebase config.');
    }
    if (null != or[r]) {
      throw Qn.create("already-exists", {
        id: r
      });
    }
    if (!ur) {
      !function (e) {
        let t = [];
        if (Array.isArray(window[e])) {
          t = window[e];
        } else {
          window[e] = t;
        }
      }("dataLayer");
      const {
        wrappedGtag: e,
        gtagCore: t
      } = function (e, t, n, r, o) {
        let a = function () {
          window[r].push(arguments);
        };
        if (window[o] && "function" == typeof window[o]) {
          a = window[o];
        }
        window[o] = Q(a, e, t, n);
        return {
          gtagCore: a,
          wrappedGtag: window[o]
        };
      }(or, ar, ir, "dataLayer", "gtag");
      cr = e;
      sr = t;
      ur = true;
    }
    or[r] = oe(e, ar, ir, t, sr, "dataLayer", n);
    return new rr(e);
  }
  function se(e = function (e = "[DEFAULT]") {
    const t = xn.get(e);
    if (!t && e === "[DEFAULT]" && yt()) {
      return f();
    }
    if (!t) {
      throw In.create("no-app", {
        appName: e
      });
    }
    return t;
  }()) {
    const t = p(e = e && e._delegate ? e._delegate : e, "analytics");
    return t.isInitialized() ? t.getImmediate() : function (e, t = {}) {
      const r = p(e, "analytics");
      if (r.isInitialized()) {
        const e = r.getImmediate();
        if (n(t, r.getOptions())) {
          return e;
        }
        throw Qn.create("already-initialized");
      }
      const o = r.initialize({
        options: t
      });
      return o;
    }(e);
  }
  function ce(e, t, n, r) {
    e = e && e._delegate ? e._delegate : e;
    (async function (e, t, n, r, o) {
      if (o && o.global) {
        e("event", n, r);
      } else {
        const o = await t;
        e("event", n, Object.assign(Object.assign({}, r), {
          send_to: o
        }));
      }
    })(cr, or[e.app.options.appId], t, n, r).catch(e => Yn.error(e));
  }
  function le(e) {
    if ("string" != typeof e || !e) {
      throw Error("expected a non-empty string, got: " + e);
    }
  }
  function de(e) {
    if ("number" != typeof e) {
      throw Error("expected a number, got: " + e);
    }
  }
  function ue(e) {
    return function (e, t) {
      const n = new Set();
      const r = [];
      for (const o of e) {
        const e = t(o);
        if (!n.has(e)) {
          n.add(e);
          r.push(o);
        }
      }
      return r;
    }(e, e => e.unicode);
  }
  function he(e, t, n) {
    n.onerror = () => t(n.error);
    n.onblocked = () => t(Error("IDB blocked"));
    n.onsuccess = () => e(n.result);
  }
  async function pe(e) {
    const t = await new Promise((t, n) => {
      const r = indexedDB.open(e, 1);
      xr[e] = r;
      r.onupgradeneeded = e => {
        if (e.oldVersion < 1) {
          (function (e) {
            function t(t, n, r) {
              const o = n ? e.createObjectStore(t, {
                keyPath: n
              }) : e.createObjectStore(t);
              if (r) {
                for (const [e, [t, n]] of Object.entries(r)) o.createIndex(e, t, {
                  multiEntry: n
                });
              }
              return o;
            }
            t("keyvalue");
            t("emoji", "unicode", {
              ["tokens"]: ["tokens", true],
              ["group-order"]: [["group", "order"]],
              ["skinUnicodes"]: ["skinUnicodes", true]
            });
            t("favorites", undefined, {
              ["count"]: [""]
            });
          })(r.result);
        }
      };
      he(t, n, r);
    });
    t.onclose = () => me(e);
    return t;
  }
  function fe(e, t, n, r) {
    return new Promise((o, a) => {
      const i = e.transaction(t, n, {
        durability: "relaxed"
      });
      const s = "string" == typeof t ? i.objectStore(t) : t.map(e => i.objectStore(e));
      let c;
      r(s, i, e => {
        c = e;
      });
      i.oncomplete = () => o(c);
      i.onerror = () => a(i.error);
    });
  }
  function me(e) {
    const t = xr[e];
    const n = t && t.result;
    if (n) {
      n.close();
      const t = Lr[e];
      if (t) {
        for (const e of t) e();
      }
    }
    delete xr[e];
    delete Sr[e];
    delete Lr[e];
  }
  function ge(e) {
    return e.split(/[\s_]+/).map(e => !e.match(/\w/) || Ir.has(e) ? e.toLowerCase() : e.replace(/[)(:,]/g, "").replace(/\u2019/g, "'").toLowerCase()).filter(Boolean);
  }
  function be(e) {
    return e.filter(Boolean).map(e => e.toLowerCase()).filter(e => e.length >= 2);
  }
  function ye(e, t, n, r) {
    e[t](n).onsuccess = e => r && r(e.target.result);
  }
  function ve(e, t, n) {
    ye(e, "get", t, n);
  }
  function we(e, t, n) {
    ye(e, "getAll", t, n);
  }
  function ke(e) {
    if (e.commit) {
      e.commit();
    }
  }
  function Ce(e, t) {
    const n = function (e, t) {
      let n = e[0];
      for (let r = 1; r < e.length; r++) {
        const o = e[r];
        if (t(n) > t(o)) {
          n = o;
        }
      }
      return n;
    }(e, e => e.length);
    const r = [];
    for (const o of n) if (!e.some(e => -1 === e.findIndex(e => t(e) === t(o)))) {
      r.push(o);
    }
    return r;
  }
  async function Ee(e, t, n, r) {
    try {
      const o = function (e) {
        const t = e.map(({
          annotation: e,
          emoticon: t,
          group: n,
          order: r,
          shortcodes: o,
          skins: a,
          tags: i,
          emoji: s,
          version: c
        }) => {
          const l = {
            annotation: e,
            group: n,
            order: r,
            tags: i,
            tokens: [...new Set(be([...(o || []).map(ge).flat(), ...(i || []).map(ge).flat(), ...ge(e), t]))].sort(),
            unicode: s,
            version: c
          };
          if (t) {
            l.emoticon = t;
          }
          if (o) {
            l.shortcodes = o;
          }
          if (a) {
            l.skinTones = [];
            l.skinUnicodes = [];
            l.skinVersions = [];
            for (const {
              tone: e,
              emoji: t,
              version: n
            } of a) {
              l.skinTones.push(e);
              l.skinUnicodes.push(t);
              l.skinVersions.push(n);
            }
          }
          return l;
        });
        return t;
      }(t);
      await fe(e, ["emoji", "keyvalue"], "readwrite", ([e, t], a) => {
        function i() {
          if (2 == ++l) {
            (function () {
              if (s !== r || c !== n) {
                e.clear();
                for (const t of o) e.put(t);
                t.put(r, "eTag");
                t.put(n, "url");
                ke(a);
              }
            })();
          }
        }
        let s;
        let c;
        let l = 0;
        ve(t, "eTag", e => {
          s = e;
          i();
        });
        ve(t, "url", e => {
          c = e;
          i();
        });
      });
    } finally {}
  }
  async function Ae(e, t) {
    const n = be(ge(t));
    return n.length ? fe(e, "emoji", "readonly", (e, t, r) => {
      const o = [];
      const a = () => {
        const e = Ce(o, e => e.unicode);
        r(e.sort((e, t) => e.order < t.order ? -1 : 1));
      };
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        const i = t === n.length - 1 ? IDBKeyRange.bound(r, r + "\uffff", false, true) : IDBKeyRange.only(r);
        we(e.index("tokens"), i, e => {
          o.push(e);
          if (o.length === n.length) {
            a();
          }
        });
      }
    }) : [];
  }
  async function Te(e, t) {
    const n = await Ae(e, t);
    if (!n.length) {
      const n = e => (e.shortcodes || []).includes(t.toLowerCase());
      return (await async function (e, t) {
        return fe(e, "emoji", "readonly", (e, n, r) => {
          let o;
          const a = () => {
            e.getAll(o && IDBKeyRange.lowerBound(o, true), 50).onsuccess = e => {
              const n = e.target.result;
              for (const e of n) {
                o = e.unicode;
                if (t(e)) {
                  return r(e);
                }
              }
              if (n.length < 50) {
                return r();
              }
              a();
            };
          };
          a();
        });
      }(e, n)) || null;
    }
    return n.filter(e => {
      const n = (e.shortcodes || []).map(e => e.toLowerCase());
      return n.includes(t.toLowerCase());
    })[0] || null;
  }
  function xe(e, t, n) {
    return fe(e, t, "readonly", (e, t, r) => ve(e, n, r));
  }
  function Se(e) {
    !function (e) {
      const t = e && Array.isArray(e);
      const n = t && e.length && (!e[0] || jr.some(t => !(t in e[0])));
      if (!t || n) {
        throw Error("Custom emojis are in the wrong format");
      }
    }(e);
    const t = (e, t) => e.name.toLowerCase() < t.name.toLowerCase() ? -1 : 1;
    const n = e.sort(t);
    const r = function (e, t) {
      const n = new Map();
      for (const r of e) {
        const e = t(r);
        for (const t of e) {
          let e = n;
          for (let n = 0; n < t.length; n++) {
            const r = t.charAt(n);
            let o = e.get(r);
            if (!o) {
              o = new Map();
              e.set(r, o);
            }
            e = o;
          }
          let o = e.get("");
          if (!o) {
            o = [];
            e.set("", o);
          }
          o.push(r);
        }
      }
      return (e, t) => {
        let r = n;
        for (let t = 0; t < e.length; t++) {
          const n = e.charAt(t);
          const o = r.get(n);
          if (!o) {
            return [];
          }
          r = o;
        }
        if (t) {
          return r.get("") || [];
        }
        const o = [];
        const a = [r];
        for (; a.length;) {
          const e = [...a.shift().entries()].sort((e, t) => e[0] < t[0] ? -1 : 1);
          for (const [t, n] of e) if ("" === t) {
            o.push(...n);
          } else {
            a.push(n);
          }
        }
        return o;
      };
    }(e, e => {
      const t = new Set();
      if (e.shortcodes) {
        for (const n of e.shortcodes) for (const e of ge(n)) t.add(e);
      }
      return t;
    });
    const o = e => r(e, true);
    const a = e => r(e, false);
    const i = new Map();
    const s = new Map();
    for (const t of e) {
      s.set(t.name.toLowerCase(), t);
      for (const e of t.shortcodes || []) i.set(e.toLowerCase(), t);
    }
    return {
      all: n,
      search: e => {
        const n = ge(e);
        const r = n.map((e, t) => (t < n.length - 1 ? o : a)(e));
        return Ce(r, e => e.name).sort(t);
      },
      byShortcode: e => i.get(e.toLowerCase()),
      byName: e => s.get(e.toLowerCase())
    };
  }
  function Le(e) {
    if (!e) {
      return e;
    }
    if (Mr) {
      e = structuredClone(e);
    }
    delete e.tokens;
    if (e.skinTones) {
      const t = e.skinTones.length;
      e.skins = Array(t);
      for (let n = 0; n < t; n++) {
        e.skins[n] = {
          tone: e.skinTones[n],
          unicode: e.skinUnicodes[n],
          version: e.skinVersions[n]
        };
      }
      delete e.skinTones;
      delete e.skinUnicodes;
      delete e.skinVersions;
    }
    return e;
  }
  function Ie(e, t) {
    if (2 !== Math.floor(e.status / 100)) {
      throw Error("Failed to fetch: " + t + ":  " + e.status);
    }
  }
  async function je(e) {
    const t = await fetch(e);
    Ie(t, e);
    const n = t.headers.get("etag");
    const r = await t.json();
    (function (e) {
      if (!e || !Array.isArray(e) || !e[0] || "object" != typeof e[0] || _r.some(t => !(t in e[0]))) {
        throw Error("Emoji data is in the wrong format");
      }
    })(r);
    return [n, r];
  }
  async function Me(e) {
    let t = function (e) {
      var t = e.length;
      var n = new ArrayBuffer(t);
      var r = new Uint8Array(n);
      for (var o = -1; ++o < t;) {
        r[o] = e.charCodeAt(o);
      }
      return n;
    }(JSON.stringify(e));
    const n = function (e) {
      var t = "";
      var n = new Uint8Array(e);
      var r = n.byteLength;
      for (var o = -1; ++o < r;) {
        t += String.fromCharCode(n[o]);
      }
      return t;
    }(await crypto.subtle.digest("SHA-1", t));
    return btoa(n);
  }
  async function _e(e, t) {
    let n;
    let r = await async function (e) {
      const t = await fetch(e, {
        method: "HEAD"
      });
      Ie(t, e);
      const n = t.headers.get("etag");
      return n;
    }(t);
    if (!r) {
      const e = await je(t);
      r = e[0];
      n = e[1];
      if (!r) {
        r = await Me(n);
      }
    }
    if (!(await async function (e, t, n) {
      const [r, o] = await Promise.all(["eTag", "url"].map(t => xe(e, "keyvalue", t)));
      return r === n && o === t;
    }(e, t, r))) {
      if (!n) {
        n = (await je(t))[1];
      }
      await Ee(e, n, t, r);
    }
  }
  function Oe(e) {
    return e.unicode.includes("\u200d");
  }
  function Pe(e) {
    const t = Rr(e, "#000");
    const n = Rr(e, "#fff");
    return t && n && ((e, t) => {
      const n = [...e].join(",");
      const r = [...t].join(",");
      return n === r && !n.startsWith("0,0,0,");
    })(t, n);
  }
  function De(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function Fe(e, t, n) {
    if ((t += e ? -1 : 1) < 0) {
      t = n.length - 1;
    } else if (t >= n.length) {
      t = 0;
    }
    return t;
  }
  function Ne(e, t) {
    const n = new Set();
    const r = [];
    for (const o of e) {
      const e = t(o);
      if (!n.has(e)) {
        n.add(e);
        r.push(o);
      }
    }
    return r;
  }
  function Be(e) {
    {
      const t = document.createRange();
      t.selectNode(e.firstChild);
      return t.getBoundingClientRect().width;
    }
  }
  function Ue(e, t, n) {
    let r = e.get(t);
    if (!r) {
      r = n();
      e.set(t, r);
    }
    return r;
  }
  function He(e) {
    return "" + e;
  }
  function Re(e, t) {
    const {
      targetNode: n
    } = t;
    let {
      targetParentNode: r
    } = t;
    let o = false;
    if (r) {
      o = function (e, t) {
        let n = e.firstChild;
        let r = 0;
        for (; n;) {
          if (t[r] !== n) {
            return true;
          }
          n = n.nextSibling;
          r++;
        }
        return r !== t.length;
      }(r, e);
    } else {
      o = true;
      t.targetNode = undefined;
      t.targetParentNode = r = n.parentNode;
    }
    if (o) {
      (function (e, t) {
        if (Yr) {
          e.replaceChildren(...t);
        } else {
          e.innerHTML = "";
          e.append(...t);
        }
      })(r, e);
    }
  }
  function ze(e) {
    let t = "";
    let n = false;
    let r = false;
    let o = -1;
    const a = new Map();
    const i = [];
    let s = 0;
    for (let c = e.length; s < c; s++) {
      const l = e[s];
      t += l;
      if (s === c - 1) {
        break;
      }
      for (let e = 0; e < l.length; e++) {
        switch (l.charAt(e)) {
          case "<":
            if ("/" === l.charAt(e + 1)) {
              i.pop();
            } else {
              n = true;
              i.push(++o);
            }
            break;
          case ">":
            n = false;
            r = false;
            break;
          case "=":
            r = true;
        }
      }
      const d = Ue(a, i[i.length - 1], () => []);
      let u;
      let h;
      let p;
      if (r) {
        const t = /(\S+)="?([^"=]*)$/.exec(l);
        u = t[1];
        h = t[2];
        p = /^[^">]*/.exec(e[s + 1])[0];
      }
      const f = {
        attributeName: u,
        attributeValuePre: h,
        attributeValuePost: p,
        expressionIndex: s
      };
      d.push(f);
      if (!(n || r)) {
        t += " ";
      }
    }
    const s = function (e) {
      const t = document.createElement("template");
      t.innerHTML = e;
      return t;
    }(t);
    return {
      template: s,
      elementsToBindings: a
    };
  }
  function We(e, t, n) {
    for (let r = 0; r < e.length; r++) {
      const o = e[r];
      const a = {
        binding: o,
        targetNode: o.attributeName ? t : t.firstChild,
        targetParentNode: undefined,
        currentExpression: undefined
      };
      n.push(a);
    }
  }
  function qe(e) {
    const {
      template: t,
      elementsToBindings: n
    } = Ue(Xr, e, () => ze(e));
    const r = t.cloneNode(true).content.firstElementChild;
    const o = function (e, t) {
      const n = [];
      let r;
      if (1 === t.size && (r = t.get(0))) {
        We(r, e, n);
      } else {
        const r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
        let o = e;
        let a = -1;
        do {
          const e = t.get(++a);
          if (e) {
            We(e, o, n);
          }
        } while (o = r.nextNode());
      }
      return n;
    }(r, n);
    return function (e) {
      (function (e, t) {
        for (const n of t) {
          const {
            targetNode: t,
            currentExpression: r,
            binding: {
              expressionIndex: o,
              attributeName: a,
              attributeValuePre: i,
              attributeValuePost: s
            }
          } = n;
          const c = e[o];
          if (r !== c) {
            n.currentExpression = c;
            if (a) {
              t.setAttribute(a, i + ("" + c) + s);
            } else {
              let e;
              if (Array.isArray(c)) {
                Re(c, n);
              } else if (c instanceof Element) {
                e = c;
                t.replaceWith(e);
              } else {
                t.nodeValue = "" + c;
              }
              if (e) {
                n.targetNode = e;
              }
            }
          }
        }
      })(e, o);
      return r;
    };
  }
  function Ve(e, t, n, r, o, a, i, s, c) {
    function l(e, n, r) {
      return f(e, (e, o) => p`<button role="${n ? "option" : "menuitem"}" aria-selected="${n ? o === t.activeSearchItem : ""}" aria-label="${d(e, t.currentSkinTone)}" title="${u(e)}" class="${"emoji" + (n && o === t.activeSearchItem ? " active" : "") + (e.unicode ? "" : " custom-emoji")}" id="${`${r}-${e.id}`}" style="${e.unicode ? "" : `--custom-emoji-background: url(${JSON.stringify(e.url)})`}">${e.unicode ? h(e, t.currentSkinTone) : ""}</button>`, e => `${r}-${e.id}`);
    }
    const {
      labelWithSkin: d,
      titleForEmoji: u,
      unicodeWithSkin: h
    } = n;
    const {
      html: p,
      map: f
    } = function (e) {
      const t = Ue(Kr, e, () => new Map());
      let n = Zr;
      return {
        map: function (e, t, r) {
          return e.map((e, o) => {
            const a = n;
            n = r(e);
            try {
              return t(e, o);
            } finally {
              n = a;
            }
          });
        },
        html: function (e, ...r) {
          const o = Ue(t, e, () => new Map());
          return Ue(o, n, () => qe(e))(r);
        }
      };
    }(t);
    const m = p`<section data-ref="rootElement" class="picker" aria-label="${t.i18n.regionLabel}" style="${t.pickerStyle || ""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${t.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!(!t.searchMode || !t.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${t.activeSearchItemId ? "emo-" + t.activeSearchItemId : ""}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${t.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${t.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${t.skinTonePickerExpandedAfterAnimation ? "expanded" : ""}"><button id="skintone-button" class="emoji ${t.skinTonePickerExpanded ? "hide-focus" : ""}" aria-label="${t.skinToneButtonLabel}" title="${t.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${t.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${t.skinToneButtonText || ""}</button></div><span id="skintone-description" class="sr-only">${t.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${t.skinTonePickerExpanded ? "" : "hidden no-animate"}" style="transform:translateY(${t.skinTonePickerExpanded ? 0 : "calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${t.i18n.skinTonesLabel}" aria-activedescendant="skintone-${t.activeSkinTone}" aria-hidden="${!t.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${f(t.skinTones, (e, n) => p`<div id="skintone-${n}" class="emoji ${n === t.activeSkinTone ? "active" : ""}" aria-selected="${n === t.activeSkinTone}" role="option" title="${t.i18n.skinTones[n]}" aria-label="${t.i18n.skinTones[n]}">${e}</div>`, e => e)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${t.groups.length},1fr)" aria-label="${t.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${f(t.groups, e => p`<button role="tab" class="nav-button" aria-controls="tab-${e.id}" aria-label="${t.i18n.categories[e.name]}" aria-selected="${!t.searchMode && t.currentGroup.id === e.id}" title="${t.i18n.categories[e.name]}" data-group-id="${e.id}"><div class="nav-emoji emoji">${e.emoji}</div></button>`, e => e.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(t.isRtl ? -1 : 1) * t.currentGroupIndex * 100}%)"></div></div><div class="message ${t.message ? "" : "gone"}" role="alert" aria-live="polite">${t.message || ""}</div><div data-ref="tabpanelElement" class="tabpanel ${!t.databaseLoaded || t.message ? "gone" : ""}" role="${t.searchMode ? "region" : "tabpanel"}" aria-label="${t.searchMode ? t.i18n.searchResultsLabel : t.i18n.categories[t.currentGroup.name]}" id="${t.searchMode ? "" : "tab-" + t.currentGroup.id}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${f(t.currentEmojisWithCategories, (e, n) => p`<div><div id="menu-label-${n}" class="category ${1 === t.currentEmojisWithCategories.length && "" === t.currentEmojisWithCategories[0].category ? "gone" : ""}" aria-hidden="true">${t.searchMode ? t.i18n.searchResultsLabel : e.category ? e.category : t.currentEmojisWithCategories.length > 1 ? t.i18n.categories.custom : t.i18n.categories[t.currentGroup.name]}</div><div class="emoji-menu ${0 === n || t.searchMode || -1 !== t.currentGroup.id ? "" : "visibility-auto"}" style="${"--num-rows: " + Math.ceil(e.emojis.length / t.numColumns)}" data-action="updateOnIntersection" role="${t.searchMode ? "listbox" : "menu"}" aria-labelledby="menu-label-${n}" id="${t.searchMode ? "search-results" : ""}">${l(e.emojis, t.searchMode, "emo")}</div></div>`, e => e.category)}</div></div><div class="favorites onscreen emoji-menu ${t.message ? "gone" : ""}" role="menu" aria-label="${t.i18n.favoritesLabel}" data-on-click="onEmojiClick">${l(t.currentFavorites, false, "fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`;
    const g = (t, n) => {
      for (const r of e.querySelectorAll(`[${t}]`)) n(r, r.getAttribute(t));
    };
    if (c) {
      e.appendChild(m);
      for (const e of ["click", "focusout", "input", "keydown", "keyup"]) g("data-on-" + e, (t, n) => {
        t.addEventListener(e, r[n]);
      });
      g("data-ref", (e, t) => {
        a[t] = e;
      });
      i.addEventListener("abort", () => {
        e.removeChild(m);
      });
    }
    g("data-action", (e, t) => {
      let n = s.get(t);
      if (!n) {
        s.set(t, n = new WeakSet());
      }
      if (!n.has(e)) {
        n.add(e);
        o[t](e);
      }
    });
  }
  function Ge(e, t, n) {
    if (e.length !== t.length) {
      return false;
    }
    for (let r = 0; r < e.length; r++) {
      if (!n(e[r], t[r])) {
        return false;
      }
    }
    return true;
  }
  function Je(e, t) {
    function n() {
      const {
        customEmoji: e,
        database: t
      } = h;
      const n = e || eo;
      if (t.customEmoji !== n) {
        t.customEmoji = n;
      }
    }
    function r(e) {
      const t = function (e, t, n) {
        let r = true;
        for (const o of e) {
          const e = Be(n(o));
          if (undefined === Gr) {
            Gr = Be(t);
          }
          const a = e / 1.8 < Gr;
          qr.set(o.unicode, a);
          if (!a) {
            r = false;
          }
        }
        return r;
      }(e, l.baselineEmoji, g);
      if (t) {
        S();
      } else {
        h.currentEmojis = [...h.currentEmojis];
      }
    }
    function o(e) {
      return !e.unicode || !e.unicode.includes("\u200d") || qr.get(e.unicode);
    }
    async function a(e) {
      const t = h.emojiVersion || (await Wr());
      return e.filter(({
        version: e
      }) => !e || e <= t);
    }
    async function i(e) {
      return function (e, t) {
        const n = e => {
          const n = {};
          for (const r of e) if ("number" == typeof r.tone && r.version <= t) {
            n[r.tone] = r.unicode;
          }
          return n;
        };
        return e.map(({
          unicode: e,
          skins: t,
          shortcodes: r,
          url: o,
          name: a,
          category: i,
          annotation: s
        }) => ({
          unicode: e,
          name: a,
          shortcodes: r,
          url: o,
          category: i,
          annotation: s,
          id: e || a,
          skins: t && n(t)
        }));
      }(e, h.emojiVersion || (await Wr()));
    }
    async function s(e) {
      const t = await h.database.getEmojiByUnicodeOrName(e);
      const n = [...h.currentEmojis, ...h.currentFavorites].find(t => t.id === e);
      const r = n.unicode && (h.currentSkinTone && n.skins && n.skins[t] || n.unicode);
      await h.database.incrementFavoriteEmojiCount(e);
      b("emoji-click", {
        emoji: t,
        skinTone: h.currentSkinTone,
        ...(r && {
          unicode: r
        }),
        ...(n.name && {
          name: n.name
        })
      });
    }
    function c(e) {
      h.currentSkinTone = e;
      h.skinTonePickerExpanded = false;
      m("skintone-button");
      b("skin-tone-change", {
        skinTone: e
      });
      h.database.setPreferredSkinTone(e);
    }
    const l = {};
    const d = new AbortController();
    const u = d.signal;
    const {
      state: h,
      createEffect: p
    } = function (e) {
      let t;
      let n = false;
      const r = new Map();
      const o = new Set();
      let a;
      const i = () => {
        if (n) {
          return;
        }
        const e = [...o];
        o.clear();
        try {
          for (const t of e) t();
        } finally {
          a = false;
          if (o.size) {
            a = true;
            Qr(i);
          }
        }
      };
      const s = new Proxy({}, {
        get(e, n) {
          if (t) {
            let e = r.get(n);
            if (!e) {
              e = new Set();
              r.set(n, e);
            }
            e.add(t);
          }
          return e[n];
        },
        set(e, t, n) {
          if (e[t] !== n) {
            e[t] = n;
            const s = r.get(t);
            if (s) {
              for (const e of s) o.add(e);
              if (!a) {
                a = true;
                Qr(i);
              }
            }
          }
          return true;
        }
      });
      e.addEventListener("abort", () => {
        n = true;
      });
      return {
        state: s,
        createEffect: e => {
          const n = () => {
            const r = t;
            t = n;
            try {
              return e();
            } finally {
              t = r;
            }
          };
          return n();
        }
      };
    }(u);
    const f = new Map();
    to(h, {
      skinToneEmoji: undefined,
      i18n: undefined,
      database: undefined,
      customEmoji: undefined,
      customCategorySorting: undefined,
      emojiVersion: undefined
    });
    to(h, t);
    to(h, {
      initialLoad: true,
      currentEmojis: [],
      currentEmojisWithCategories: [],
      rawSearchText: "",
      searchText: "",
      searchMode: false,
      activeSearchItem: -1,
      message: undefined,
      skinTonePickerExpanded: false,
      skinTonePickerExpandedAfterAnimation: false,
      currentSkinTone: 0,
      activeSkinTone: 0,
      skinToneButtonText: undefined,
      pickerStyle: undefined,
      skinToneButtonLabel: "",
      skinTones: [],
      currentFavorites: [],
      defaultFavoriteEmojis: undefined,
      numColumns: 8,
      isRtl: false,
      currentGroupIndex: 0,
      groups: Dr,
      databaseLoaded: false,
      activeSearchItemId: undefined
    });
    p(() => {
      if (h.currentGroup !== h.groups[h.currentGroupIndex]) {
        h.currentGroup = h.groups[h.currentGroupIndex];
      }
    });
    const m = t => {
      e.getElementById(t).focus();
    };
    const g = t => e.getElementById("emo-" + t.id);
    const b = (e, t) => {
      l.rootElement.dispatchEvent(new CustomEvent(e, {
        detail: t,
        bubbles: true,
        composed: true
      }));
    };
    const y = (e, t) => e.id === t.id;
    const v = (e, t) => {
      const {
        category: n,
        emojis: r
      } = e;
      const {
        category: o,
        emojis: a
      } = t;
      return n === o && Ge(r, a, y);
    };
    const w = e => {
      if (!Ge(h.currentEmojis, e, y)) {
        h.currentEmojis = e;
      }
    };
    const k = e => {
      if (h.searchMode !== e) {
        h.searchMode = e;
      }
    };
    const C = (e, t) => t && e.skins && e.skins[t] || e.unicode;
    const E = {
      labelWithSkin: (e, t) => {
        n = [e.name || t && e.skins && e.skins[t] || e.unicode, e.annotation, ...(e.shortcodes || eo)].filter(Boolean);
        return Ne(n, e => e).join(", ");
        var n;
      },
      titleForEmoji: e => e.annotation || (e.shortcodes || eo).join(", "),
      unicodeWithSkin: C
    };
    const A = {
      onClickSkinToneButton: function (e) {
        h.skinTonePickerExpanded = !h.skinTonePickerExpanded;
        h.activeSkinTone = h.currentSkinTone;
        if (h.skinTonePickerExpanded) {
          De(e);
          requestAnimationFrame(() => m("skintone-list"));
        }
      },
      onEmojiClick: async function (e) {
        const {
          target: t
        } = e;
        if (t.classList.contains("emoji")) {
          De(e);
          s(t.id.substring(4));
        }
      },
      onNavClick: function (e) {
        const {
          target: t
        } = e;
        const n = t.closest(".nav-button");
        if (!n) {
          return;
        }
        const r = parseInt(n.dataset.groupId, 10);
        l.searchElement.value = "";
        h.rawSearchText = "";
        h.searchText = "";
        h.activeSearchItem = -1;
        h.currentGroupIndex = h.groups.findIndex(e => e.id === r);
      },
      onNavKeydown: function (e) {
        const {
          target: t,
          key: n
        } = e;
        const r = t => {
          if (t) {
            De(e);
            t.focus();
          }
        };
        switch (n) {
          case "ArrowLeft":
            return r(t.previousElementSibling);
          case "ArrowRight":
            return r(t.nextElementSibling);
          case "Home":
            return r(t.parentElement.firstElementChild);
          case "End":
            return r(t.parentElement.lastElementChild);
        }
      },
      onSearchKeydown: function (e) {
        if (!h.searchMode || !h.currentEmojis.length) {
          return;
        }
        const t = t => {
          De(e);
          h.activeSearchItem = Fe(t, h.activeSearchItem, h.currentEmojis);
        };
        switch (e.key) {
          case "ArrowDown":
            return t(false);
          case "ArrowUp":
            return t(true);
          case "Enter":
            if (-1 !== h.activeSearchItem) {
              De(e);
              return s(h.currentEmojis[h.activeSearchItem].id);
            }
            h.activeSearchItem = 0;
        }
      },
      onSkinToneOptionsClick: function (e) {
        const {
          target: {
            id: t
          }
        } = e;
        const n = t && t.match(/^skintone-(\d)/);
        if (n) {
          De(e);
          c(parseInt(n[1], 10));
        }
      },
      onSkinToneOptionsFocusOut: async function (e) {
        const {
          relatedTarget: t
        } = e;
        if (!(t && "skintone-list" === t.id)) {
          h.skinTonePickerExpanded = false;
        }
      },
      onSkinToneOptionsKeydown: function (e) {
        if (!h.skinTonePickerExpanded) {
          return;
        }
        const t = async t => {
          De(e);
          h.activeSkinTone = t;
        };
        switch (e.key) {
          case "ArrowUp":
            return t(Fe(true, h.activeSkinTone, h.skinTones));
          case "ArrowDown":
            return t(Fe(false, h.activeSkinTone, h.skinTones));
          case "Home":
            return t(0);
          case "End":
            return t(h.skinTones.length - 1);
          case "Enter":
            De(e);
            return c(h.activeSkinTone);
          case "Escape":
            De(e);
            h.skinTonePickerExpanded = false;
            return m("skintone-button");
        }
      },
      onSkinToneOptionsKeyup: function (e) {
        if (h.skinTonePickerExpanded) {
          return " " === e.key ? (De(e), c(h.activeSkinTone)) : undefined;
        }
      },
      onSearchInput: function (e) {
        h.rawSearchText = e.target.value;
      }
    };
    const T = {
      calculateEmojiGridStyle: function (e) {
        !function (e, t, n) {
          let r;
          if (Jr) {
            r = new ResizeObserver(n);
            r.observe(e);
          } else {
            requestAnimationFrame(n);
          }
          t.addEventListener("abort", () => {
            if (r) {
              r.disconnect();
            }
          });
        }(e, u, () => {
          {
            const e = getComputedStyle(l.rootElement);
            const t = parseInt(e.getPropertyValue("--num-columns"), 10);
            const n = "rtl" === e.getPropertyValue("direction");
            h.numColumns = t;
            h.isRtl = n;
          }
        });
      },
      updateOnIntersection: function (e) {
        !function (e, t, n) {
          {
            const r = e.closest(".tabpanel");
            let o = $r.get(r);
            if (!o) {
              o = new IntersectionObserver(n, {
                root: r,
                rootMargin: "50% 0px 50% 0px",
                threshold: 0
              });
              $r.set(r, o);
              t.addEventListener("abort", () => {
                o.disconnect();
              });
            }
            o.observe(e);
          }
        }(e, u, e => {
          for (const {
            target: t,
            isIntersecting: n
          } of e) t.classList.toggle("onscreen", n);
        });
      }
    };
    let x = true;
    p(() => {
      Ve(e, h, E, A, T, l, u, f, x);
      x = false;
    });
    if (!h.emojiVersion) {
      Wr().then(e => {
        if (!e) {
          h.message = h.i18n.emojiUnsupportedMessage;
        }
      });
    }
    p(() => {
      if (h.database) {
        (async function () {
          let e = false;
          const t = setTimeout(() => {
            e = true;
            h.message = h.i18n.loadingMessage;
          }, 1e3);
          try {
            await h.database.ready();
            h.databaseLoaded = true;
          } catch (e) {
            h.message = h.i18n.networkErrorMessage;
          } finally {
            clearTimeout(t);
            if (e) {
              e = false;
              h.message = "";
            }
          }
        })();
      }
    });
    p(() => {
      h.pickerStyle = `\n      --num-groups: ${h.groups.length}; \n      --indicator-opacity: ${h.searchMode ? 0 : 1}; \n      --num-skintones: 6;`;
    });
    p(() => {
      if (h.customEmoji && h.database) {
        n();
      }
    });
    p(() => {
      if (h.customEmoji && h.customEmoji.length) {
        if (h.groups !== Pr) {
          h.groups = Pr;
        }
      } else if (h.groups !== Dr) {
        if (h.currentGroupIndex) {
          h.currentGroupIndex--;
        }
        h.groups = Dr;
      }
    });
    p(() => {
      !async function () {
        if (h.databaseLoaded) {
          h.currentSkinTone = await h.database.getPreferredSkinTone();
        }
      }();
    });
    p(() => {
      h.skinTones = [,,,,,,].fill().map((e, t) => function (e, t) {
        if (0 === t) {
          return e;
        }
        const n = e.indexOf("\u200d");
        return -1 !== n ? e.substring(0, n) + String.fromCodePoint(127995 + t - 1) + e.substring(n) : (e.endsWith("\ufe0f") && (e = e.substring(0, e.length - 1)), e + "\ud83c" + String.fromCodePoint(57339 + t - 1));
      }(h.skinToneEmoji, t));
    });
    p(() => {
      h.skinToneButtonText = h.skinTones[h.currentSkinTone];
    });
    p(() => {
      h.skinToneButtonLabel = h.i18n.skinToneLabel.replace("{skinTone}", h.i18n.skinTones[h.currentSkinTone]);
    });
    p(() => {
      if (h.databaseLoaded) {
        (async function () {
          const {
            database: e
          } = h;
          const t = (await Promise.all(Br.map(t => e.getEmojiByUnicodeOrName(t)))).filter(Boolean);
          h.defaultFavoriteEmojis = t;
        })();
      }
    });
    p(() => {
      if (h.databaseLoaded && h.defaultFavoriteEmojis) {
        (async function () {
          n();
          const {
            database: e,
            defaultFavoriteEmojis: t,
            numColumns: r
          } = h;
          const o = await e.getTopFavoriteEmoji(r);
          const a = await i(Ne([...o, ...t], e => e.unicode || e.name).slice(0, r));
          h.currentFavorites = a;
        })();
      }
    });
    p(() => {
      !async function () {
        const {
          searchText: e,
          currentGroup: t,
          databaseLoaded: n,
          customEmoji: r
        } = h;
        if (n) {
          if (e.length >= 2) {
            const t = await async function (e) {
              return i(await a(await h.database.getEmojiBySearchQuery(e)));
            }(e);
            if (h.searchText === e) {
              w(t);
              k(true);
            }
          } else {
            const {
              id: e
            } = t;
            if (-1 !== e || r && r.length) {
              const t = await async function (e) {
                const t = -1 === e ? h.customEmoji : await h.database.getEmojiByGroup(e);
                return i(await a(t));
              }(e);
              if (h.currentGroup.id === e) {
                w(t);
                k(false);
              }
            }
          }
        } else {
          h.currentEmojis = [];
          h.searchMode = false;
        }
      }();
    });
    const S = () => {
      requestAnimationFrame(() => {
        var e;
        if (e = l.tabpanelElement) {
          e.scrollTop = 0;
        }
      });
    };
    p(() => {
      const {
        currentEmojis: e,
        emojiVersion: t
      } = h;
      const n = e.filter(e => e.unicode).filter(e => e.unicode.includes("\u200d") && !qr.has(e.unicode));
      if (!t && n.length) {
        w(e);
        requestAnimationFrame(() => r(n));
      } else {
        const n = t ? e : e.filter(o);
        w(n);
        S();
      }
    });
    p(() => {});
    p(() => {
      const e = function () {
        const {
          searchMode: e,
          currentEmojis: t
        } = h;
        if (e) {
          return [{
            category: "",
            emojis: t
          }];
        }
        const n = new Map();
        for (const e of t) {
          const t = e.category || "";
          let r = n.get(t);
          if (!r) {
            r = [];
            n.set(t, r);
          }
          r.push(e);
        }
        return [...n.entries()].map(([e, t]) => ({
          category: e,
          emojis: t
        })).sort((e, t) => h.customCategorySorting(e.category, t.category));
      }();
      (e => {
        if (!Ge(h.currentEmojisWithCategories, e, v)) {
          h.currentEmojisWithCategories = e;
        }
      })(e);
    });
    p(() => {
      h.activeSearchItemId = -1 !== h.activeSearchItem && h.currentEmojis[h.activeSearchItem].id;
    });
    p(() => {
      const {
        rawSearchText: e
      } = h;
      Fr(() => {
        h.searchText = (e || "").trim();
        h.activeSearchItem = -1;
      });
    });
    p(() => {
      if (h.skinTonePickerExpanded) {
        l.skinToneDropdown.addEventListener("transitionend", () => {
          h.skinTonePickerExpandedAfterAnimation = true;
        }, {
          once: true
        });
      } else {
        h.skinTonePickerExpandedAfterAnimation = false;
      }
    });
    return {
      $set(e) {
        to(h, e);
      },
      $destroy() {
        d.abort();
      }
    };
  }
  function Xe(e) {
    try {
      new DataView(e, 0, 0);
      return true;
    } catch (e) {
      return false;
    }
  }
  function Ke(e) {
    return ArrayBuffer.isView(e) && "Uint8Array" === e[Symbol.toStringTag];
  }
  function Ze() {
    return Math.floor(4294967296 * Math.random());
  }
  function Ye(e, t) {
    return yi(e, {
      i: 2
    }, t && t.out, t && t.dictionary);
  }
  function Qe(e) {
    return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
  }
  function $e() {
    return new TransformStream({
      transform(e, t) {
        !function (e, t) {
          if (Di && e.data instanceof Blob) {
            e.data.arrayBuffer().then(Qe).then(t);
          } else if (Fi && (e.data instanceof ArrayBuffer || ("function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(e.data) : e.data && e.data.buffer instanceof ArrayBuffer))) {
            t(e.data instanceof Uint8Array ? e.data : e.data instanceof ArrayBuffer ? new Uint8Array(e.data) : new Uint8Array(e.data.buffer, e.data.byteOffset, e.data.byteLength));
          } else {
            Bi(e, false, e => {
              if (!Hi) {
                Hi = new TextEncoder();
              }
              t(Hi.encode(e));
            });
          }
        }(e, n => {
          const r = n.length;
          let o;
          if (r < 126) {
            o = new Uint8Array(1);
            new DataView(o.buffer).setUint8(0, r);
          } else if (r < 65536) {
            o = new Uint8Array(3);
            const e = new DataView(o.buffer);
            e.setUint8(0, 126);
            e.setUint16(1, r);
          } else {
            o = new Uint8Array(9);
            const e = new DataView(o.buffer);
            e.setUint8(0, 127);
            e.setBigUint64(1, BigInt(r));
          }
          if (e.data && "string" != typeof e.data) {
            o[0] |= 128;
          }
          t.enqueue(o);
          t.enqueue(n);
        });
      }
    });
  }
  function et(e) {
    return e.reduce((e, t) => e + t.length, 0);
  }
  function tt(e, t) {
    if (e[0].length === t) {
      return e.shift();
    }
    const n = new Uint8Array(t);
    let r = 0;
    for (let o = 0; o < t; o++) {
      n[o] = e[0][r++];
      if (r === e[0].length) {
        e.shift();
        r = 0;
      }
    }
    if (e.length && r < e[0].length) {
      e[0] = e[0].slice(r);
    }
    return n;
  }
  function nt(e) {
    if (e) {
      return function (e) {
        for (var t in nt.prototype) e[t] = nt.prototype[t];
        return e;
      }(e);
    }
  }
  function rt(e, ...t) {
    return t.reduce((t, n) => (e.hasOwnProperty(n) && (t[n] = e[n]), t), {});
  }
  function ot(e, t) {
    if (t.useNativeTimers) {
      e.setTimeoutFn = Zi.bind(Ki);
      e.clearTimeoutFn = Yi.bind(Ki);
    } else {
      e.setTimeoutFn = Ki.setTimeout.bind(Ki);
      e.clearTimeoutFn = Ki.clearTimeout.bind(Ki);
    }
  }
  function at() {
    return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
  }
  function it() {}
  function st() {
    for (let e in os.requests) if (os.requests.hasOwnProperty(e)) {
      os.requests[e].abort();
    }
  }
  function ct(e) {
    const t = e.xdomain;
    try {
      if ("undefined" != typeof XMLHttpRequest && (!t || ns)) {
        return new XMLHttpRequest();
      }
    } catch (e) {}
    if (!t) {
      try {
        return new Ki[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }
  function lt(e) {
    if (e.length > 8e3) {
      throw "URI too long";
    }
    const t = e;
    const n = e.indexOf("[");
    const r = e.indexOf("]");
    if (-1 != n && -1 != r) {
      e = e.substring(0, n) + e.substring(n, r).replace(/:/g, ";") + e.substring(r, e.length);
    }
    let o = ds.exec(e || "");
    let a = {};
    let i = 14;
    for (; i--;) {
      a[us[i]] = o[i] || "";
    }
    if (-1 != n && -1 != r) {
      a.source = t;
      a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":");
      a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
      a.ipv6uri = true;
    }
    a.pathNames = function (e, t) {
      const n = /\/{2,9}/g;
      const r = t.replace(n, "/").split("/");
      if (!("/" != t.slice(0, 1) && 0 !== t.length)) {
        r.splice(0, 1);
      }
      if ("/" == t.slice(-1)) {
        r.splice(r.length - 1, 1);
      }
      return r;
    }(0, a.path);
    a.queryKey = function (e, t) {
      const n = {};
      t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (e, t, r) {
        if (t) {
          n[t] = r;
        }
      });
      return n;
    }(0, a.query);
    return a;
  }
  var dt = {
    g: function () {
      if ("object" == typeof globalThis) {
        return globalThis;
      }
      try {
        return this || Function("return this")();
      } catch (e) {
        if ("object" == typeof window) {
          return window;
        }
      }
    }()
  };
  const ut = function (e) {
    const t = [];
    let n = 0;
    for (let r = 0; r < e.length; r++) {
      let o = e.charCodeAt(r);
      if (o < 128) {
        t[n++] = o;
      } else if (o < 2048) {
        t[n++] = o >> 6 | 192;
        t[n++] = 63 & o | 128;
      } else if (55296 == (64512 & o) && r + 1 < e.length && 56320 == (64512 & e.charCodeAt(r + 1))) {
        o = 65536 + ((1023 & o) << 10) + (1023 & e.charCodeAt(++r));
        t[n++] = o >> 18 | 240;
        t[n++] = o >> 12 & 63 | 128;
        t[n++] = o >> 6 & 63 | 128;
        t[n++] = 63 & o | 128;
      } else {
        t[n++] = o >> 12 | 224;
        t[n++] = o >> 6 & 63 | 128;
        t[n++] = 63 & o | 128;
      }
    }
    return t;
  };
  const ht = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    HAS_NATIVE_SUPPORT: "function" == typeof atob,
    encodeByteArray(e, t) {
      if (!Array.isArray(e)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const r = [];
      for (let t = 0; t < e.length; t += 3) {
        const o = e[t];
        const a = t + 1 < e.length;
        const i = a ? e[t + 1] : 0;
        const s = t + 2 < e.length;
        const c = s ? e[t + 2] : 0;
        const l = o >> 2;
        const d = (3 & o) << 4 | i >> 4;
        let u = (15 & i) << 2 | c >> 6;
        let h = 63 & c;
        if (!s) {
          h = 64;
          if (!a) {
            u = 64;
          }
        }
        r.push(n[l], n[d], n[u], n[h]);
      }
      return r.join("");
    },
    encodeString(e, t) {
      return this.HAS_NATIVE_SUPPORT && !t ? btoa(e) : this.encodeByteArray(ut(e), t);
    },
    decodeString(e, t) {
      return this.HAS_NATIVE_SUPPORT && !t ? atob(e) : function (e) {
        const t = [];
        let n = 0;
        let r = 0;
        for (; n < e.length;) {
          const o = e[n++];
          if (o < 128) {
            t[r++] = String.fromCharCode(o);
          } else if (o > 191 && o < 224) {
            const a = e[n++];
            t[r++] = String.fromCharCode((31 & o) << 6 | 63 & a);
          } else if (o > 239 && o < 365) {
            const a = ((7 & o) << 18 | (63 & e[n++]) << 12 | (63 & e[n++]) << 6 | 63 & e[n++]) - 65536;
            t[r++] = String.fromCharCode(55296 + (a >> 10));
            t[r++] = String.fromCharCode(56320 + (1023 & a));
          } else {
            const a = e[n++];
            const i = e[n++];
            t[r++] = String.fromCharCode((15 & o) << 12 | (63 & a) << 6 | 63 & i);
          }
        }
        return t.join("");
      }(this.decodeStringToByteArray(e, t));
    },
    decodeStringToByteArray(e, t) {
      this.init_();
      const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const r = [];
      for (let t = 0; t < e.length;) {
        const o = n[e.charAt(t++)];
        const a = t < e.length ? n[e.charAt(t)] : 0;
        ++t;
        const i = t < e.length ? n[e.charAt(t)] : 64;
        ++t;
        const s = t < e.length ? n[e.charAt(t)] : 64;
        ++t;
        if (null == o || null == a || null == i || null == s) {
          throw new pt();
        }
        const c = o << 2 | a >> 4;
        r.push(c);
        if (64 !== i) {
          const e = a << 4 & 240 | i >> 2;
          r.push(e);
          if (64 !== s) {
            const e = i << 6 & 192 | s;
            r.push(e);
          }
        }
      }
      return r;
    },
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let e = 0; e < this.ENCODED_VALS.length; e++) {
          this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e);
          this.charToByteMap_[this.byteToCharMap_[e]] = e;
          this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e;
          if (e >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e;
          }
        }
      }
    }
  };
  class pt extends Error {
    constructor() {
      super(...arguments);
      this.name = "DecodeBase64StringError";
    }
  }
  const ft = function (e) {
    return function (e) {
      const t = ut(e);
      return ht.encodeByteArray(t, true);
    }(e).replace(/\./g, "");
  };
  const mt = function (e) {
    try {
      return ht.decodeString(e, true);
    } catch (e) {}
    return null;
  };
  const gt = () => function () {
    if ("undefined" != typeof self) {
      return self;
    }
    if ("undefined" != typeof window) {
      return window;
    }
    if (undefined !== dt.g) {
      return dt.g;
    }
    throw Error("Unable to locate global object.");
  }().__FIREBASE_DEFAULTS__;
  const bt = () => {
    try {
      return gt() || (() => {
        if ("undefined" == typeof process || undefined === process.env) {
          return;
        }
        const e = process.env.__FIREBASE_DEFAULTS__;
        return e ? JSON.parse(e) : undefined;
      })() || (() => {
        if ("undefined" == typeof document) {
          return;
        }
        let e;
        try {
          e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
        } catch (e) {
          return;
        }
        const t = e && mt(e[1]);
        return t && JSON.parse(t);
      })();
    } catch (e) {
      return;
    }
  };
  const yt = () => {
    var e;
    return null === (e = bt()) || undefined === e ? undefined : e.config;
  };
  class vt {
    constructor() {
      this.reject = () => {};
      this.resolve = () => {};
      this.promise = new Promise((e, t) => {
        this.resolve = e;
        this.reject = t;
      });
    }
    wrapCallback(e) {
      return (t, n) => {
        if (t) {
          this.reject(t);
        } else {
          this.resolve(n);
        }
        if ("function" == typeof e) {
          this.promise.catch(() => {});
          if (1 === e.length) {
            e(t);
          } else {
            e(t, n);
          }
        }
      };
    }
  }
  class wt extends Error {
    constructor(e, t, n) {
      super(t);
      this.code = e;
      this.customData = n;
      this.name = "FirebaseError";
      Object.setPrototypeOf(this, wt.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, kt.prototype.create);
      }
    }
  }
  class kt {
    constructor(e, t, n) {
      this.service = e;
      this.serviceName = t;
      this.errors = n;
    }
    create(e, ...t) {
      const n = t[0] || {};
      const o = this.errors[e];
      const a = o ? function (e, t) {
        return e.replace(Ct, (e, n) => {
          const r = t[n];
          return null != r ? r + "" : `<${n}?>`;
        });
      }(o, n) : "Error";
      return new wt(`${this.service}/${e}`, `${this.serviceName}: ${a} (${`${this.service}/${e}`}).`, n);
    }
  }
  const Ct = /\{\$([^}]+)}/g;
  class Et {
    constructor(e, t, n) {
      this.name = e;
      this.instanceFactory = t;
      this.type = n;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(e) {
      this.instantiationMode = e;
      return this;
    }
    setMultipleInstances(e) {
      this.multipleInstances = e;
      return this;
    }
    setServiceProps(e) {
      this.serviceProps = e;
      return this;
    }
    setInstanceCreatedCallback(e) {
      this.onInstanceCreated = e;
      return this;
    }
  }
  class Tt {
    constructor(e, t) {
      this.name = e;
      this.container = t;
      this.component = null;
      this.instances = new Map();
      this.instancesDeferred = new Map();
      this.instancesOptions = new Map();
      this.onInitCallbacks = new Map();
    }
    get(e) {
      const t = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(t)) {
        const e = new vt();
        this.instancesDeferred.set(t, e);
        if (this.isInitialized(t) || this.shouldAutoInitialize()) {
          try {
            const n = this.getOrInitializeService({
              instanceIdentifier: t
            });
            if (n) {
              e.resolve(n);
            }
          } catch (e) {}
        }
      }
      return this.instancesDeferred.get(t).promise;
    }
    getImmediate(e) {
      var t;
      const n = this.normalizeInstanceIdentifier(null == e ? undefined : e.identifier);
      const r = null !== (t = null == e ? undefined : e.optional) && undefined !== t && t;
      if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
        if (r) {
          return null;
        }
        throw Error(`Service ${this.name} is not available`);
      }
      try {
        return this.getOrInitializeService({
          instanceIdentifier: n
        });
      } catch (e) {
        if (r) {
          return null;
        }
        throw e;
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(e) {
      if (e.name !== this.name) {
        throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
      }
      if (this.component) {
        throw Error(`Component for ${this.name} has already been provided`);
      }
      this.component = e;
      if (this.shouldAutoInitialize()) {
        if (function (e) {
          return "EAGER" === e.instantiationMode;
        }(e)) {
          try {
            this.getOrInitializeService({
              instanceIdentifier: "[DEFAULT]"
            });
          } catch (e) {}
        }
        for (const [e, t] of this.instancesDeferred.entries()) {
          const n = this.normalizeInstanceIdentifier(e);
          try {
            const e = this.getOrInitializeService({
              instanceIdentifier: n
            });
            t.resolve(e);
          } catch (e) {}
        }
      }
    }
    clearInstance(e = "[DEFAULT]") {
      this.instancesDeferred.delete(e);
      this.instancesOptions.delete(e);
      this.instances.delete(e);
    }
    async delete() {
      const e = Array.from(this.instances.values());
      await Promise.all([...e.filter(e => "INTERNAL" in e).map(e => e.INTERNAL.delete()), ...e.filter(e => "_delete" in e).map(e => e._delete())]);
    }
    isComponentSet() {
      return null != this.component;
    }
    isInitialized(e = "[DEFAULT]") {
      return this.instances.has(e);
    }
    getOptions(e = "[DEFAULT]") {
      return this.instancesOptions.get(e) || {};
    }
    initialize(e = {}) {
      const {
        options: t = {}
      } = e;
      const n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(n)) {
        throw Error(`${this.name}(${n}) has already been initialized`);
      }
      if (!this.isComponentSet()) {
        throw Error(`Component ${this.name} has not been registered yet`);
      }
      const r = this.getOrInitializeService({
        instanceIdentifier: n,
        options: t
      });
      for (const [e, t] of this.instancesDeferred.entries()) if (n === this.normalizeInstanceIdentifier(e)) {
        t.resolve(r);
      }
      return r;
    }
    onInit(e, t) {
      var n;
      const r = this.normalizeInstanceIdentifier(t);
      const o = null !== (n = this.onInitCallbacks.get(r)) && undefined !== n ? n : new Set();
      o.add(e);
      this.onInitCallbacks.set(r, o);
      const a = this.instances.get(r);
      if (a) {
        e(a, r);
      }
      return () => {
        o.delete(e);
      };
    }
    invokeOnInitCallbacks(e, t) {
      const n = this.onInitCallbacks.get(t);
      if (n) {
        for (const r of n) try {
          r(e, t);
        } catch (e) {}
      }
    }
    getOrInitializeService({
      instanceIdentifier: e,
      options: t = {}
    }) {
      let n = this.instances.get(e);
      if (!n && this.component && (n = this.component.instanceFactory(this.container, {
        instanceIdentifier: (r = e, r === "[DEFAULT]" ? undefined : r),
        options: t
      }), this.instances.set(e, n), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(n, e), this.component.onInstanceCreated)) {
        try {
          this.component.onInstanceCreated(this.container, e, n);
        } catch (e) {}
      }
      var r;
      return n || null;
    }
    normalizeInstanceIdentifier(e = "[DEFAULT]") {
      return this.component ? this.component.multipleInstances ? e : "[DEFAULT]" : e;
    }
    shouldAutoInitialize() {
      return !!this.component && "EXPLICIT" !== this.component.instantiationMode;
    }
  }
  class xt {
    constructor(e) {
      this.name = e;
      this.providers = new Map();
    }
    addComponent(e) {
      const t = this.getProvider(e.name);
      if (t.isComponentSet()) {
        throw Error(`Component ${e.name} has already been registered with ${this.name}`);
      }
      t.setComponent(e);
    }
    addOrOverwriteComponent(e) {
      if (this.getProvider(e.name).isComponentSet()) {
        this.providers.delete(e.name);
      }
      this.addComponent(e);
    }
    getProvider(e) {
      if (this.providers.has(e)) {
        return this.providers.get(e);
      }
      const t = new Tt(e, this);
      this.providers.set(e, t);
      return t;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  const St = [];
  var Lt;
  !function (e) {
    e[e.DEBUG = 0] = "DEBUG";
    e[e.VERBOSE = 1] = "VERBOSE";
    e[e.INFO = 2] = "INFO";
    e[e.WARN = 3] = "WARN";
    e[e.ERROR = 4] = "ERROR";
    e[e.SILENT = 5] = "SILENT";
  }(Lt || (Lt = {}));
  const It = {
    debug: Lt.DEBUG,
    verbose: Lt.VERBOSE,
    info: Lt.INFO,
    warn: Lt.WARN,
    error: Lt.ERROR,
    silent: Lt.SILENT
  };
  const jt = Lt.INFO;
  const Mt = {
    [Lt.DEBUG]: "log",
    [Lt.VERBOSE]: "log",
    [Lt.INFO]: "info",
    [Lt.WARN]: "warn",
    [Lt.ERROR]: "error"
  };
  const _t = (e, t) => {
    if (!(t < e.logLevel || (new Date().toISOString(), Mt[t]))) {
      throw Error(`Attempted to log a message with an invalid logType (value: ${t})`);
    }
  };
  class Ot {
    constructor(e) {
      this.name = e;
      this._logLevel = jt;
      this._logHandler = _t;
      this._userLogHandler = null;
      St.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(e) {
      if (!(e in Lt)) {
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
      }
      this._logLevel = e;
    }
    setLogLevel(e) {
      this._logLevel = "string" == typeof e ? It[e] : e;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(e) {
      if ("function" != typeof e) {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = e;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(e) {
      this._userLogHandler = e;
    }
    debug(...e) {
      if (this._userLogHandler) {
        this._userLogHandler(this, Lt.DEBUG, ...e);
      }
      this._logHandler(this, Lt.DEBUG, ...e);
    }
    log(...e) {
      if (this._userLogHandler) {
        this._userLogHandler(this, Lt.VERBOSE, ...e);
      }
      this._logHandler(this, Lt.VERBOSE, ...e);
    }
    info(...e) {
      if (this._userLogHandler) {
        this._userLogHandler(this, Lt.INFO, ...e);
      }
      this._logHandler(this, Lt.INFO, ...e);
    }
    warn(...e) {
      if (this._userLogHandler) {
        this._userLogHandler(this, Lt.WARN, ...e);
      }
      this._logHandler(this, Lt.WARN, ...e);
    }
    error(...e) {
      if (this._userLogHandler) {
        this._userLogHandler(this, Lt.ERROR, ...e);
      }
      this._logHandler(this, Lt.ERROR, ...e);
    }
  }
  let Pt;
  let Dt;
  const Ft = new WeakMap();
  const Nt = new WeakMap();
  const Bt = new WeakMap();
  const Ut = new WeakMap();
  const Ht = new WeakMap();
  let Rt = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ("done" === t) {
          return Nt.get(e);
        }
        if ("objectStoreNames" === t) {
          return e.objectStoreNames || Bt.get(e);
        }
        if ("store" === t) {
          return n.objectStoreNames[1] ? undefined : n.objectStore(n.objectStoreNames[0]);
        }
      }
      return c(e[t]);
    },
    set: (e, t, n) => (e[t] = n, true),
    has: (e, t) => e instanceof IDBTransaction && ("done" === t || "store" === t) || t in e
  };
  const zt = e => Ht.get(e);
  const Wt = ["get", "getKey", "getAll", "getAllKeys", "count"];
  const qt = ["put", "add", "delete", "clear"];
  const Vt = new Map();
  var Gt;
  Gt = Rt;
  Rt = {
    ...Gt,
    get: (e, t, n) => d(e, t) || Gt.get(e, t, n),
    has: (e, t) => !!d(e, t) || Gt.has(e, t)
  };
  class Jt {
    constructor(e) {
      this.container = e;
    }
    getPlatformInfoString() {
      return this.container.getProviders().map(e => {
        if (function (e) {
          const t = e.getComponent();
          return "VERSION" === (null == t ? undefined : t.type);
        }(e)) {
          const t = e.getImmediate();
          return `${t.library}/${t.version}`;
        }
        return null;
      }).filter(e => e).join(" ");
    }
  }
  const Zt = new Ot("@firebase/app");
  const Tn = {
    ["@firebase/app"]: "fire-core",
    ["@firebase/app-compat"]: "fire-core-compat",
    ["@firebase/analytics"]: "fire-analytics",
    ["@firebase/analytics-compat"]: "fire-analytics-compat",
    ["@firebase/app-check"]: "fire-app-check",
    ["@firebase/app-check-compat"]: "fire-app-check-compat",
    ["@firebase/auth"]: "fire-auth",
    ["@firebase/auth-compat"]: "fire-auth-compat",
    ["@firebase/database"]: "fire-rtdb",
    ["@firebase/data-connect"]: "fire-data-connect",
    ["@firebase/database-compat"]: "fire-rtdb-compat",
    ["@firebase/functions"]: "fire-fn",
    ["@firebase/functions-compat"]: "fire-fn-compat",
    ["@firebase/installations"]: "fire-iid",
    ["@firebase/installations-compat"]: "fire-iid-compat",
    ["@firebase/messaging"]: "fire-fcm",
    ["@firebase/messaging-compat"]: "fire-fcm-compat",
    ["@firebase/performance"]: "fire-perf",
    ["@firebase/performance-compat"]: "fire-perf-compat",
    ["@firebase/remote-config"]: "fire-rc",
    ["@firebase/remote-config-compat"]: "fire-rc-compat",
    ["@firebase/storage"]: "fire-gcs",
    ["@firebase/storage-compat"]: "fire-gcs-compat",
    ["@firebase/firestore"]: "fire-fst",
    ["@firebase/firestore-compat"]: "fire-fst-compat",
    ["@firebase/vertexai"]: "fire-vertex",
    "fire-js": "fire-js",
    ["firebase"]: "fire-js-all"
  };
  const xn = new Map();
  const Sn = new Map();
  const Ln = new Map();
  const In = new kt("app", "Firebase", {
    "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
    "bad-app-name": "Illegal App name: '{$appName}'",
    "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "server-app-deleted": "Firebase Server App has been deleted",
    "no-options": "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument": "First argument to `onLog` must be null or a function.",
    "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    "finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    "invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
  });
  class jn {
    constructor(e, t, n) {
      this._isDeleted = false;
      this._options = Object.assign({}, e);
      this._config = Object.assign({}, t);
      this._name = t.name;
      this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled;
      this._container = n;
      this.container.addComponent(new Et("app", () => this, "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(e) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = e;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(e) {
      this._isDeleted = e;
    }
    checkDestroyed() {
      if (this.isDeleted) {
        throw In.create("app-deleted", {
          appName: this._name
        });
      }
    }
  }
  let _n = null;
  class On {
    constructor(e) {
      this.container = e;
      this._heartbeatsCache = null;
      const t = this.container.getProvider("app").getImmediate();
      this._storage = new Pn(t);
      this._heartbeatsCachePromise = this._storage.read().then(e => (this._heartbeatsCache = e, e));
    }
    async triggerHeartbeat() {
      var e;
      var t;
      try {
        const n = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString();
        const r = new Date().toISOString().substring(0, 10);
        if (null == (null === (e = this._heartbeatsCache) || undefined === e ? undefined : e.heartbeats) && (this._heartbeatsCache = await this._heartbeatsCachePromise, null == (null === (t = this._heartbeatsCache) || undefined === t ? undefined : t.heartbeats))) {
          return;
        }
        if (this._heartbeatsCache.lastSentHeartbeatDate === r || this._heartbeatsCache.heartbeats.some(e => e.date === r)) {
          return;
        }
        this._heartbeatsCache.heartbeats.push({
          date: r,
          agent: n
        });
        if (this._heartbeatsCache.heartbeats.length > 30) {
          const e = function (e) {
            if (0 === e.length) {
              return -1;
            }
            let t = 0;
            let n = e[0].date;
            for (let r = 1; r < e.length; r++) {
              if (e[r].date < n) {
                n = e[r].date;
                t = r;
              }
            }
            return t;
          }(this._heartbeatsCache.heartbeats);
          this._heartbeatsCache.heartbeats.splice(e, 1);
        }
        return this._storage.overwrite(this._heartbeatsCache);
      } catch (e) {
        Zt.warn(e);
      }
    }
    async getHeartbeatsHeader() {
      var e;
      try {
        if (null === this._heartbeatsCache) {
          await this._heartbeatsCachePromise;
        }
        if (null == (null === (e = this._heartbeatsCache) || undefined === e ? undefined : e.heartbeats) || 0 === this._heartbeatsCache.heartbeats.length) {
          return "";
        }
        const t = new Date().toISOString().substring(0, 10);
        const {
          heartbeatsToSend: n,
          unsentEntries: r
        } = function (e, t = 1024) {
          const n = [];
          let r = e.slice();
          for (const o of e) {
            const e = n.find(e => e.agent === o.agent);
            if (e) {
              e.dates.push(o.date);
              if (ft(JSON.stringify({
                version: 2,
                heartbeats: n
              })).length > t) {
                e.dates.pop();
                break;
              }
            } else {
              n.push({
                agent: o.agent,
                dates: [o.date]
              });
              if (ft(JSON.stringify({
                version: 2,
                heartbeats: n
              })).length > t) {
                n.pop();
                break;
              }
            }
            r = r.slice(1);
          }
          return {
            heartbeatsToSend: n,
            unsentEntries: r
          };
        }(this._heartbeatsCache.heartbeats);
        const o = ft(JSON.stringify({
          version: 2,
          heartbeats: n
        }));
        this._heartbeatsCache.lastSentHeartbeatDate = t;
        if (r.length > 0) {
          this._heartbeatsCache.heartbeats = r;
          await this._storage.overwrite(this._heartbeatsCache);
        } else {
          this._heartbeatsCache.heartbeats = [];
          this._storage.overwrite(this._heartbeatsCache);
        }
        return o;
      } catch (e) {
        Zt.warn(e);
        return "";
      }
    }
  }
  class Pn {
    constructor(e) {
      this.app = e;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      return !!e() && t().then(() => true).catch(() => false);
    }
    async read() {
      if (await this._canUseIndexedDBPromise) {
        const e = await async function (e) {
          try {
            const t = (await g()).transaction("firebase-heartbeat-store");
            const n = await t.objectStore("firebase-heartbeat-store").get(`${e.name}!${e.options.appId}`);
            await t.done;
            return n;
          } catch (e) {
            if (e instanceof wt) {
              Zt.warn(e.message);
            } else {
              const t = In.create("idb-get", {
                originalErrorMessage: null == e ? undefined : e.message
              });
              Zt.warn(t.message);
            }
          }
        }(this.app);
        return (null == e ? undefined : e.heartbeats) ? e : {
          heartbeats: []
        };
      }
      return {
        heartbeats: []
      };
    }
    async overwrite(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return b(this.app, {
          lastSentHeartbeatDate: null !== (t = e.lastSentHeartbeatDate) && undefined !== t ? t : n.lastSentHeartbeatDate,
          heartbeats: e.heartbeats
        });
      }
    }
    async add(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return b(this.app, {
          lastSentHeartbeatDate: null !== (t = e.lastSentHeartbeatDate) && undefined !== t ? t : n.lastSentHeartbeatDate,
          heartbeats: [...n.heartbeats, ...e.heartbeats]
        });
      }
    }
  }
  "";
  h(new Et("platform-logger", e => new Jt(e), "PRIVATE"));
  h(new Et("heartbeat", e => new On(e), "PRIVATE"));
  m("@firebase/app", "0.11.1", "");
  m("@firebase/app", "0.11.1", "esm2017");
  m("fire-js", "");
  m("firebase", "11.3.1", "app");
  const Un = "w:0.6.12";
  const Rn = new kt("installations", "Installations", {
    "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
    "not-registered": "Firebase Installation is not registered.",
    "installation-not-found": "Firebase Installation not found.",
    "request-failed": '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
    "app-offline": "Could not process request. Application offline.",
    "delete-pending-registration": "Can't delete installation while there is a pending registration request."
  });
  const zn = /^[cdef][\w-]{21}$/;
  const Wn = new Map();
  let qn = null;
  let Gn = null;
  const Xn = e => {
    const t = p(e.getProvider("app").getImmediate(), "installations").getImmediate();
    return {
      getId: () => async function (e) {
        const {
          installationEntry: n,
          registrationPromise: r
        } = await U(e);
        if (r) {
          r.catch(console.error);
        } else {
          q(e).catch(console.error);
        }
        return n.fid;
      }(t),
      getToken: e => J(t, e)
    };
  };
  h(new Et("installations", e => {
    const t = e.getProvider("app").getImmediate();
    const n = function (e) {
      if (!e || !e.options) {
        throw Rn.create("missing-app-config-values", {
          valueName: "App Configuration"
        });
      }
      if (!e.name) {
        throw Rn.create("missing-app-config-values", {
          valueName: "App Name"
        });
      }
      const t = ["projectId", "apiKey", "appId"];
      for (const n of t) if (!e.options[n]) {
        throw Rn.create("missing-app-config-values", {
          valueName: n
        });
      }
      return {
        appName: e.name,
        projectId: e.options.projectId,
        apiKey: e.options.apiKey,
        appId: e.options.appId
      };
    }(t);
    return {
      app: t,
      appConfig: n,
      heartbeatServiceProvider: p(t, "heartbeat"),
      _delete: () => Promise.resolve()
    };
  }, "PUBLIC"));
  h(new Et("installations-internal", Xn, "PRIVATE"));
  m("@firebase/installations", "0.6.12");
  m("@firebase/installations", "0.6.12", "esm2017");
  const Yn = new Ot("@firebase/analytics");
  const Qn = new kt("analytics", "Analytics", {
    "already-exists": "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
    "already-initialized": "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.",
    "already-initialized-settings": "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
    "interop-component-reg-failed": "Firebase Analytics Interop Component failed to instantiate: {$reason}",
    "invalid-analytics-context": "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
    "indexeddb-unavailable": "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
    "fetch-throttle": "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
    "config-fetch-failed": "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
    "no-api-key": 'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
    "no-app-id": 'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
    "no-client-id": 'The "client_id" field is empty.',
    "invalid-gtag-resource": "Trusted Types detected an invalid gtag resource: {$gtagURL}."
  });
  const $n = new class {
    constructor(e = {}, t = 1e3) {
      this.throttleMetadata = e;
      this.intervalMillis = t;
    }
    getThrottleMetadata(e) {
      return this.throttleMetadata[e];
    }
    setThrottleMetadata(e, t) {
      this.throttleMetadata[e] = t;
    }
    deleteThrottleMetadata(e) {
      delete this.throttleMetadata[e];
    }
  }();
  class er {
    constructor() {
      this.listeners = [];
    }
    addEventListener(e) {
      this.listeners.push(e);
    }
    abort() {
      this.listeners.forEach(e => e());
    }
  }
  let tr;
  let nr;
  class rr {
    constructor(e) {
      this.app = e;
    }
    _delete() {
      delete or[this.app.options.appId];
      return Promise.resolve();
    }
  }
  let or = {};
  let ar = [];
  const ir = {};
  let sr;
  let cr;
  let ur = false;
  h(new Et("analytics", (e, {
    options: t
  }) => ie(e.getProvider("app").getImmediate(), e.getProvider("installations-internal").getImmediate(), t), "PUBLIC"));
  h(new Et("analytics-internal", function (e) {
    try {
      const t = e.getProvider("analytics").getImmediate();
      return {
        logEvent: (e, n, r) => ce(t, e, n, r)
      };
    } catch (e) {
      throw Qn.create("interop-component-reg-failed", {
        reason: e
      });
    }
  }, "PRIVATE"));
  m("@firebase/analytics", "0.10.11");
  m("@firebase/analytics", "0.10.11", "esm2017");
  const xr = {};
  const Sr = {};
  const Lr = {};
  const Ir = new Set([":D", "XD", ":'D", "O:)", ":X", ":P", ";P", "XP", ":L", ":Z", ":j", "8D", "XO", "8)", ":B", ":O", ":S", ":'o", "Dx", "X(", "D:", ":C", ">0)", ":3", "</3", "<3", "\\M/", ":E", "8#"]);
  const jr = ["name", "url"];
  const Mr = "undefined" != typeof wrappedJSObject;
  const _r = ["annotation", "emoji", "group", "order", "version"];
  class Or {
    constructor({
      dataSource: e = "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",
      locale: t = "en",
      customEmoji: n = []
    } = {}) {
      this.dataSource = e;
      this.locale = t;
      this._dbName = "emoji-picker-element-" + this.locale;
      this._db = undefined;
      this._lazyUpdate = undefined;
      this._custom = Se(n);
      this._clear = this._clear.bind(this);
      this._ready = this._init();
    }
    async _init() {
      t = this._dbName;
      if (!Sr[t]) {
        Sr[t] = pe(t);
      }
      const e = this._db = await Sr[t];
      var t;
      !function (e, t) {
        let n = Lr[e];
        if (!n) {
          n = Lr[e] = [];
        }
        n.push(t);
      }(this._dbName, this._clear);
      const n = this.dataSource;
      const r = await async function (e) {
        return !(await xe(e, "keyvalue", "url"));
      }(e);
      if (r) {
        await async function (e, t) {
          let [n, r] = await je(t);
          if (!n) {
            n = await Me(r);
          }
          await Ee(e, r, t, n);
        }(e, n);
      } else {
        this._lazyUpdate = _e(e, n);
      }
    }
    async ready() {
      const e = async () => (this._ready || (this._ready = this._init()), this._ready);
      await e();
      if (!this._db) {
        await e();
      }
    }
    async getEmojiByGroup(e) {
      de(e);
      await this.ready();
      return ue(await async function (e, t) {
        return fe(e, "emoji", "readonly", (e, n, r) => {
          const o = IDBKeyRange.bound([t, 0], [t + 1, 0], false, true);
          we(e.index("group-order"), o, r);
        });
      }(this._db, e)).map(Le);
    }
    async getEmojiBySearchQuery(e) {
      le(e);
      await this.ready();
      return [...this._custom.search(e), ...ue(await Ae(this._db, e)).map(Le)];
    }
    async getEmojiByShortcode(e) {
      le(e);
      await this.ready();
      const t = this._custom.byShortcode(e);
      return t || Le(await Te(this._db, e));
    }
    async getEmojiByUnicodeOrName(e) {
      le(e);
      await this.ready();
      const t = this._custom.byName(e);
      return t || Le(await async function (e, t) {
        return fe(e, "emoji", "readonly", (e, n, r) => ve(e, t, n => {
          if (n) {
            return r(n);
          }
          ve(e.index("skinUnicodes"), t, e => r(e || null));
        }));
      }(this._db, e));
    }
    async getPreferredSkinTone() {
      await this.ready();
      return (await xe(this._db, "keyvalue", "skinTone")) || 0;
    }
    async setPreferredSkinTone(e) {
      de(e);
      await this.ready();
      return function (e, t, n, r) {
        return fe(e, t, "readwrite", (e, t) => {
          e.put(r, n);
          ke(t);
        });
      }(this._db, "keyvalue", "skinTone", e);
    }
    async incrementFavoriteEmojiCount(e) {
      le(e);
      await this.ready();
      t = this._db;
      return fe(t, "favorites", "readwrite", (e, t) => ve(e, e, r => {
        e.put((r || 0) + 1, e);
        ke(t);
      }));
      var t;
    }
    async getTopFavoriteEmoji(e) {
      de(e);
      await this.ready();
      return (await function (e, t, n) {
        return 0 === n ? [] : fe(e, ["favorites", "emoji"], "readonly", ([e, r], o, a) => {
          const i = [];
          e.index("count").openCursor(undefined, "prev").onsuccess = e => {
            function o(e) {
              i.push(e);
              if (i.length === n) {
                return a(i);
              }
              s.continue();
            }
            const s = e.target.result;
            if (!s) {
              return a(i);
            }
            const c = s.primaryKey;
            const l = t.byName(c);
            if (l) {
              return o(l);
            }
            ve(r, c, e => {
              if (e) {
                return o(e);
              }
              s.continue();
            });
          };
        });
      }(this._db, this._custom, e)).map(Le);
    }
    set customEmoji(e) {
      this._custom = Se(e);
    }
    get customEmoji() {
      return this._custom.all;
    }
    async _shutdown() {
      await this.ready();
      try {
        await this._lazyUpdate;
      } catch (e) {}
    }
    _clear() {
      this._db = this._ready = this._lazyUpdate = undefined;
    }
    async close() {
      await this._shutdown();
      await me(this._dbName);
    }
    async delete() {
      var e;
      await this._shutdown();
      e = this._dbName;
      await new Promise((t, n) => {
        me(e);
        he(t, n, indexedDB.deleteDatabase(e));
      });
    }
  }
  const Pr = [[-1, "\u2728", "custom"], [0, "\u{1f600}", "smileys-emotion"], [1, "\u{1f44b}", "people-body"], [3, "\u{1f431}", "animals-nature"], [4, "\u{1f34e}", "food-drink"], [5, "\u{1f3e0}\ufe0f", "travel-places"], [6, "\u26bd", "activities"], [7, "\u{1f4dd}", "objects"], [8, "\u26d4\ufe0f", "symbols"], [9, "\u{1f3c1}", "flags"]].map(([e, t, n]) => ({
    id: e,
    emoji: t,
    name: n
  }));
  const Dr = Pr.slice(1);
  const Fr = "function" == typeof requestIdleCallback ? requestIdleCallback : setTimeout;
  const Nr = {
    "\u{1fae9}": 16,
    "\u{1fae8}": 15.1,
    "\u{1fae0}": 14,
    "\u{1f972}": 13.1,
    "\u{1f97b}": 12.1,
    "\u{1f970}": 11,
    "\u{1f929}": 5,
    "\u{1f471}\u200d\u2640\ufe0f": 4,
    "\u{1f923}": 3,
    "\u{1f441}\ufe0f\u200d\u{1f5e8}\ufe0f": 2,
    "\u{1f600}": 1,
    "\u{1f610}\ufe0f": .7,
    "\u{1f603}": .6
  };
  const Br = ["\u{1f60a}", "\u{1f612}", "\u2764\ufe0f", "\u{1f44d}\ufe0f", "\u{1f60d}", "\u{1f602}", "\u{1f62d}", "\u263a\ufe0f", "\u{1f614}", "\u{1f629}", "\u{1f60f}", "\u{1f495}", "\u{1f64c}", "\u{1f618}"];
  const Hr = (e, t) => e < t ? -1 : e > t ? 1 : 0;
  const Rr = (e, t) => {
    const n = document.createElement("canvas");
    n.width = n.height = 1;
    const r = n.getContext("2d", {
      willReadFrequently: true
    });
    r.textBaseline = "top";
    r.font = "100px \"Twemoji Mozilla\",\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\",\"EmojiOne Color\",\"Android Emoji\",sans-serif";
    r.fillStyle = t;
    r.scale(.01, .01);
    r.fillText(e, 0, 0);
    return r.getImageData(0, 0, 1, 1).data;
  };
  let zr;
  const Wr = () => (zr || (zr = new Promise(e => Fr(() => e(function () {
    const e = Object.entries(Nr);
    try {
      for (const [t, n] of e) if (Pe(t)) {
        return n;
      }
    } catch (e) {}
    return e[0][1];
  }())))), zr);
  const qr = new Map();
  let Gr;
  let Jr = "function" == typeof ResizeObserver;
  const Xr = new WeakMap();
  const Kr = new WeakMap();
  const Zr = Symbol("un-keyed");
  const Yr = "replaceChildren" in Element.prototype;
  const Qr = "function" == typeof queueMicrotask ? queueMicrotask : e => Promise.resolve().then(e);
  const $r = new WeakMap();
  const eo = [];
  const {
    assign: to
  } = Object;
  var no = {
    categoriesLabel: "Categories",
    emojiUnsupportedMessage: "Your browser does not support color emoji.",
    favoritesLabel: "Favorites",
    loadingMessage: "Loading\u2026",
    networkErrorMessage: "Could not load emoji.",
    regionLabel: "Emoji picker",
    searchDescription: "When search results are available, press up or down to select and enter to choose.",
    searchLabel: "Search",
    searchResultsLabel: "Search results",
    skinToneDescription: "When expanded, press up or down to select and enter to choose.",
    skinToneLabel: "Choose a skin tone (currently {skinTone})",
    skinTonesLabel: "Skin tones",
    skinTones: ["Default", "Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"],
    categories: {
      custom: "Custom",
      "smileys-emotion": "Smileys and emoticons",
      "people-body": "People and body",
      "animals-nature": "Animals and nature",
      "food-drink": "Food and drink",
      "travel-places": "Travel and places",
      activities: "Activities",
      objects: "Objects",
      symbols: "Symbols",
      flags: "Flags"
    }
  };
  const ro = ["customEmoji", "customCategorySorting", "database", "dataSource", "i18n", "locale", "skinToneEmoji", "emojiVersion"];
  class ao extends HTMLElement {
    constructor(e) {
      super();
      this.attachShadow({
        mode: "open"
      });
      const t = document.createElement("style");
      t.textContent = ':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}' + `:host{--emoji-font-family:${'"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif'}}`;
      this.shadowRoot.appendChild(t);
      this._ctx = {
        locale: "en",
        dataSource: "https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",
        skinToneEmoji: "\u{1f590}\ufe0f",
        customCategorySorting: Hr,
        customEmoji: null,
        i18n: no,
        emojiVersion: null,
        ...e
      };
      for (const e of ro) if ("database" !== e && Object.prototype.hasOwnProperty.call(this, e)) {
        this._ctx[e] = this[e];
        delete this[e];
      }
      this._dbFlush();
    }
    connectedCallback() {
      if (!this._cmp) {
        this._cmp = Je(this.shadowRoot, this._ctx);
      }
    }
    disconnectedCallback() {
      Qr(() => {
        if (!this.isConnected && this._cmp) {
          this._cmp.$destroy();
          this._cmp = undefined;
          const {
            database: e
          } = this._ctx;
          e.close().catch(() => {});
        }
      });
    }
    static get observedAttributes() {
      return ["locale", "data-source", "skin-tone-emoji", "emoji-version"];
    }
    attributeChangedCallback(e, t, n) {
      this._set(e.replace(/-([a-z])/g, (e, t) => t.toUpperCase()), "emoji-version" === e ? parseFloat(n) : n);
    }
    _set(e, t) {
      this._ctx[e] = t;
      if (this._cmp) {
        this._cmp.$set({
          [e]: t
        });
      }
      if (["locale", "dataSource"].includes(e)) {
        this._dbFlush();
      }
    }
    _dbCreate() {
      const {
        locale: e,
        dataSource: t,
        database: n
      } = this._ctx;
      if (!(n && n.locale === e && n.dataSource === t)) {
        this._set("database", new Or({
          locale: e,
          dataSource: t
        }));
      }
    }
    _dbFlush() {
      Qr(() => this._dbCreate());
    }
  }
  const io = {};
  for (const e of ro) io[e] = {
    get() {
      if ("database" === e) {
        this._dbCreate();
      }
      return this._ctx[e];
    },
    set(t) {
      if ("database" === e) {
        throw Error("database is read-only");
      }
      this._set(e, t);
    }
  };
  Object.defineProperties(ao.prototype, io);
  if (!customElements.get("emoji-picker")) {
    customElements.define("emoji-picker", ao);
  }
  const so = Object.freeze(Object.setPrototypeOf(() => {
    throw so;
  }, null));
  const co = new Uint8Array(new ArrayBuffer(0), 0, 0);
  const lo = Object.setPrototypeOf(function () {
    return Reflect.construct(Uint8Array, arguments, lo);
  }, null);
  const uo = Object.freeze(Object.create(null, {
    [Symbol.toStringTag]: {
      value: "Buffer",
      writable: false,
      enumerable: false,
      configurable: false
    }
  }));
  Object.defineProperty(lo, "from", {
    value: e => {
      if (null == e || "object" != typeof e) {
        throw Error("Invalid buffer source");
      }
      return ArrayBuffer.isView(e) && "Uint8Array" === e[Symbol.toStringTag] ? e : Xe(e) ? new Uint8Array(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : Uint8Array.from(e);
    },
    writable: false,
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(lo, "concat", {
    value: (e, t) => {
      if (null == e || "object" != typeof e) {
        throw Error("Invalid sources");
      }
      if (!Array.isArray(e)) {
        e = Array.from(e);
      }
      if ("number" != typeof t) {
        t = 0;
        for (const {
          byteLength: n
        } of e) {
          if (!Number.isSafeInteger(n) || n < 0) {
            throw Error("Invalid buffer object");
          }
          t += n;
        }
      }
      const n = new Uint8Array(t);
      let r = 0;
      for (const t of e) {
        const e = t.byteLength;
        n.set("length" in t ? t : new Uint8Array("buffer" in t ? t.buffer : t, 0, e), r += e);
      }
      return n;
    }
  });
  Object.defineProperty(lo, "prototype", {
    value: uo,
    writable: false,
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(lo, "emptyBuffer", {
    value: co,
    writable: false,
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(lo, "isArrayBuffer", {
    value: Xe,
    writable: false,
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(lo, Symbol.hasInstance, {
    value: Ke,
    writable: false,
    enumerable: false,
    configurable: false
  });
  const ho = Object.freeze(lo);
  const po = Object.setPrototypeOf(function () {
    if ("function" != typeof new.target) {
      return Object.create(fo);
    }
    for (let e = Object.getPrototypeOf(this); null != e; e = Object.getPrototypeOf(e)) {
      try {
        delete e.constructor;
      } catch (e) {}
    }
  }, null);
  const fo = Object.freeze(Object.create(null));
  Object.defineProperty(po, "prototype", {
    value: fo,
    writable: false,
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(po, Symbol.hasInstance, {
    value: () => false,
    writable: false,
    enumerable: false,
    configurable: false
  });
  const mo = Object.freeze(po);
  class go extends mo {
    #e;
    #t;
    #n;
    get closed() {
      return this.#n;
    }
    get canRead() {
      return this.#e;
    }
    get canWrite() {
      return this.#t;
    }
    constructor(e, t) {
      super();
      this.#e = e ?? false;
      this.#t = t ?? false;
      this.#n = false;
    }
    close() {
      this.#n = true;
    }
  }
  class bo extends go {
    constructor() {
      super(true, false);
    }
    read() {
      return -1;
    }
    readBuf(e) {
      const t = e.byteLength;
      for (let n = 0; n < t; n++) {
        const t = this.read();
        if (!(t >= 0)) {
          return n;
        }
        e[n] = t;
      }
      return t;
    }
    readNBytes(e) {
      const t = new Uint8Array(e);
      const n = this.readBuf(t);
      return n < e ? t.slice(0, n) : t;
    }
  }
  class yo extends go {
    constructor() {
      super(false, true);
    }
    write(e) {}
    flush() {}
  }
  const wo = {
    encode: e => {
      let t = "";
      let n = 0;
      let r = 0;
      for (let o = 0; o < e.length; o++) {
        n = n << 8 | e[o];
        for (r += 8; r >= 5;) {
          t += "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"[n >> r - 5 & 31];
          r -= 5;
        }
      }
      for (r > 0 && (t += "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"[n << 5 - r & 31]); t.length % 8 != 0;) {
        t += "=";
      }
      return t;
    },
    decode: e => {
      e = e.replace(/=+$/, "");
      const t = [];
      let n = 0;
      let r = 0;
      for (let o = 0; o < e.length; o++) {
        const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(e[o].toUpperCase());
        if (a < 0) {
          throw Error("Invalid character found in Base32 string.");
        }
        n = n << 5 | a;
        r += 5;
        if (r >= 8) {
          t.push(n >> r - 8 & 255);
          r -= 8;
        }
      }
      return Uint8Array.from(t);
    }
  };
  const ko = Object.freeze(Object.setPrototypeOf(wo, null));
  const Eo = new Uint8Array(new ArrayBuffer(256), 0, 256);
  for (let e = 0; e < 64; e++) {
    Eo["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(e)] = e;
  }
  const Ao = {
    encode: e => {
      const t = e.byteLength;
      let n = "";
      for (let r = 0; r < t; r += 3) {
        const t = e[r] << 16 | e[r + 1] << 8 | e[r + 2];
        n += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t >> 18 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t >> 12 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t >> 6 & 63] + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[63 & t];
      }
      switch (t % 3) {
        case 1:
          return n.slice(0, -2) + "==";
        case 2:
          return n.slice(0, -1) + "=";
        default:
          return n;
      }
    },
    decode: e => {
      const t = e.length;
      const n = new Uint8Array(.75 * t - ("==" === e.slice(t - 2) ? 2 : "=" === e[t - 1] ? 1 : 0));
      let r = 0;
      for (let o = 0; o < t; o += 4) {
        const t = Eo[e.charCodeAt(o)] << 18 | Eo[e.charCodeAt(o + 1)] << 12 | Eo[e.charCodeAt(o + 2)] << 6 | Eo[e.charCodeAt(o + 3)];
        n[r++] = t >> 16 & 255;
        n[r++] = t >> 8 & 255;
        n[r++] = 255 & t;
      }
      return n;
    }
  };
  const To = Object.freeze(Object.setPrototypeOf(Ao, null));
  const So = e => {
    let t = "";
    for (let n = 0; n <= 3; n++) {
      t += "0123456789abcdef".charAt(e >> 8 * n + 4 & 15) + "0123456789abcdef".charAt(e >> 8 * n & 15);
    }
    return t;
  };
  const Lo = (e, t) => {
    let n = (65535 & e) + (65535 & t);
    return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
  };
  const Io = (e, t, n, r, o, a) => Lo(((e, t) => e << t | e >>> 32 - t)(Lo(Lo(t, e), Lo(r, a)), o), n);
  const jo = (e, t, n, r, o, a, i) => Io(t & n | ~t & r, e, t, o, a, i);
  const Mo = (e, t, n, r, o, a, i) => Io(t & r | n & ~r, e, t, o, a, i);
  const _o = (e, t, n, r, o, a, i) => Io(t ^ n ^ r, e, t, o, a, i);
  const Oo = (e, t, n, r, o, a, i) => Io(n ^ (t | ~r), e, t, o, a, i);
  const Po = {
    encode: e => {
      const t = [];
      for (const n of Array.from(e, e => e.codePointAt(0) || 65533)) if (n < 128) {
        t.push(n);
      } else if (n < 2048) {
        t.push(n >> 6 | 192, 63 & n | 128);
      } else if (n < 65536) {
        t.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
      } else {
        t.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
      }
      return Uint8Array.from(t);
    },
    decode: e => {
      const t = e.byteLength;
      let n = "";
      for (let r = 0; r < t;) {
        const t = e[r++];
        if (128 & t) {
          if (192 == (224 & t)) {
            n += String.fromCharCode((31 & t) << 6 | 63 & e[r++]);
          } else if (224 == (240 & t)) {
            n += String.fromCharCode((15 & t) << 12 | (63 & e[r++]) << 6 | 63 & e[r++]);
          } else if (240 == (248 & t)) {
            const o = (7 & t) << 18 | (63 & e[r++]) << 12 | (63 & e[r++]) << 6 | 63 & e[r++];
            n += o > 1114111 ? "\ufffd" : String.fromCodePoint(o);
          } else {
            n += "\ufffd";
          }
        } else {
          n += String.fromCharCode(t);
        }
      }
      return n;
    }
  };
  const Do = Object.freeze(Object.setPrototypeOf(Po, null));
  const Fo = {
    encode: e => Uint8Array.from(e, e => e.charCodeAt(0)),
    decode: e => Array.from(e, e => String.fromCharCode(e)).join("")
  };
  const No = Object.freeze(Object.setPrototypeOf(Fo, null));
  const Bo = {
    encode: e => {
      const t = 2 * e.length;
      const n = new ArrayBuffer(t);
      const r = new DataView(n, 0, t);
      let n = 0;
      for (let o = 0; n < t; n += 2, o++) {
        r.setUint16(n, e.charCodeAt(o) || 65533, false);
      }
      return new Uint8Array(n, 0, t);
    },
    decode: e => {
      const t = Math.floor(e.byteLength / 2);
      const n = Array(t);
      const r = new DataView(e.buffer, e.byteOffset, 2 * t);
      let e = 0;
      for (let o = 0; o < t; e += 2, o++) {
        n[o] = String.fromCharCode(r.getUint16(e, false));
      }
      return n.join("");
    }
  };
  const Uo = Object.freeze(Object.setPrototypeOf(Bo, null));
  const Ho = {
    encode: e => {
      const t = 2 * e.length;
      const n = new ArrayBuffer(t);
      const r = new DataView(n, 0, t);
      let n = 0;
      for (let o = 0; n < t; n += 2, o++) {
        r.setUint16(n, e.charCodeAt(o) || 65533, true);
      }
      return new Uint8Array(n, 0, t);
    },
    decode: e => {
      const t = Math.floor(e.byteLength / 2);
      const n = Array(t);
      const r = new DataView(e.buffer, e.byteOffset, 2 * t);
      let e = 0;
      for (let o = 0; o < t; e += 2, o++) {
        n[o] = String.fromCharCode(r.getUint16(e, true));
      }
      return n.join("");
    }
  };
  const Ro = Object.freeze(Object.setPrototypeOf(Ho, null));
  const zo = {
    encode: e => {
      const t = Array.from(e, e => e.codePointAt(0) || 65533);
      const n = 4 * t.length;
      const r = new ArrayBuffer(n);
      const o = new DataView(r, 0, n);
      let e = 0;
      for (let r = 0; e < n; e += 4, r++) {
        o.setUint32(e, t[r], false);
      }
      return new Uint8Array(r, 0, n);
    },
    decode: e => {
      const t = Math.floor(e.byteLength / 4);
      const n = Array(t);
      const r = new DataView(e.buffer, e.byteOffset, 4 * t);
      let e = 0;
      for (let o = 0; o < t; e += 4, o++) {
        const t = r.getUint32(e, false);
        n[o] = t > 1114111 ? "\ufffd" : String.fromCodePoint(t);
      }
      return n.join("");
    }
  };
  const Wo = Object.freeze(Object.setPrototypeOf(zo, null));
  const qo = {
    encode: e => Array.from(e, e => {
      const t = (255 & e).toString(16);
      return 1 === t.length ? "0" + t : t;
    }).join(""),
    decode: e => {
      const t = Math.floor(e.length / 2);
      const n = new Uint8Array(new ArrayBuffer(t), 0, t);
      let r = 0;
      for (let o = 0; r < t; r++) {
        n[r] = parseInt(e.slice(o, o += 2), 16);
      }
      return n;
    }
  };
  const Vo = Object.freeze(Object.setPrototypeOf(qo, null));
  class Go extends bo {
    #r;
    constructor(e) {
      super();
      this.#r = e;
    }
    read() {
      return 255 & Math.floor(256 * this.#r.rand());
    }
    readBuf(e) {
      this.#r.randbuf(e);
      return e.byteLength;
    }
    readNBytes(e) {
      return this.#r.randbuf(new Uint8Array(new ArrayBuffer(e), 0, e));
    }
    get closed() {
      return false;
    }
    close() {}
  }
  class Jo extends mo {
    #o;
    get seed() {
      return this.#o;
    }
    static [Symbol.hasInstance](e) {
      try {
        e.#o;
        return true;
      } catch (e) {
        return false;
      }
    }
    constructor(e) {
      super();
      this.#o = e || null;
    }
    rand() {
      throw Error("Function not implemented");
    }
    randbuf(e) {
      const t = e.byteLength;
      for (let n = 0; n < t; n++) {
        e[n] = 255 & Math.floor(256 * this.rand());
      }
      return e;
    }
    randint(e, t) {
      return (t ||= 0) + Math.floor(this.rand() * ((e || 4294967295) - t));
    }
    setSeed(e) {
      this.#o = e || null;
    }
    createStream() {
      return new Go(this);
    }
  }
  class Xo extends Jo {
    #a;
    #i;
    #s;
    #c;
    constructor(e) {
      super(e ||= [Math.floor(4294967296 * Math.random()), Math.floor(4294967296 * Math.random()), Math.floor(4294967296 * Math.random()), Math.floor(4294967296 * Math.random())]);
      if (!Array.isArray(e) || 4 !== e.length) {
        throw Error("Invalid seed value");
      }
      this.#a = e[0];
      this.#i = e[1];
      this.#s = e[2];
      this.#c = e[3];
    }
    rand() {
      let e = this.#a |= 0;
      let t = this.#i |= 0;
      let n = this.#s |= 0;
      let r = this.#c |= 0;
      let o = (e + t | 0) + r | 0;
      r = r + 1 | 0;
      e = t ^ t >>> 9;
      t = n + (n << 3) | 0;
      n = n << 21 | n >>> 11;
      n = n + o | 0;
      this.#a = e;
      this.#i = t;
      this.#s = n;
      this.#c = r;
      return (o >>> 0) / 4294967296;
    }
    setSeed(e) {
      if (!Array.isArray(e) || 4 !== e.length) {
        throw Error("Invalid seed value");
      }
      this.#a = e[0];
      this.#i = e[1];
      this.#s = e[2];
      this.#c = e[3];
      super.setSeed(e);
    }
  }
  class Ko extends Jo {
    #l;
    constructor(e) {
      super(e ||= Math.floor(4294967296 * Math.random()));
      this.#l = e;
    }
    rand() {
      const e = this.#l = 2654435769 + (0 | this.#l) | 0;
      let t = e ^ e >>> 16;
      t = Math.imul(t, 569420461);
      t ^= t >>> 15;
      t = Math.imul(t, 1935289751);
      return ((t ^= t >>> 15) >>> 0) / 4294967296;
    }
    setSeed(e) {
      this.#l = e;
      super.setSeed(e);
    }
  }
  class Zo extends Jo {
    #l;
    constructor(e) {
      super(e ||= Math.floor(4294967296 * Math.random()));
      this.#l = e;
    }
    rand() {
      let e = this.#l = 1831565813 + (0 | this.#l);
      e = Math.imul(e ^ e >>> 15, 1 | e);
      e ^= e + Math.imul(e ^ e >>> 7, 61 | e);
      return ((e ^ e >>> 14) >>> 0) / 4294967296;
    }
    setSeed(e) {
      this.#l = e;
      super.setSeed(e);
    }
  }
  class Yo extends Jo {
    #a;
    #i;
    #s;
    #c;
    constructor(e) {
      super(e ||= [Math.floor(4294967296 * Math.random()), Math.floor(4294967296 * Math.random()), Math.floor(4294967296 * Math.random()), Math.floor(4294967296 * Math.random())]);
      if (!Array.isArray(e) || 4 !== e.length) {
        throw Error("Invalid seed value");
      }
      this.#a = e[0];
      this.#i = e[1];
      this.#s = e[2];
      this.#c = e[3];
    }
    rand() {
      let e = this.#a |= 0;
      let t = this.#i |= 0;
      let n = this.#s |= 0;
      let r = this.#c |= 0;
      let o = t << 9;
      let a = 5 * t;
      a = 9 * (a << 7 | a >>> 25);
      n ^= e;
      r ^= t;
      t ^= n;
      e ^= r;
      n ^= o;
      r = r << 11 | r >>> 21;
      this.#a = e;
      this.#i = t;
      this.#s = n;
      this.#c = r;
      return (a >>> 0) / 4294967296;
    }
    setSeed(e) {
      if (!Array.isArray(e) || 4 !== e.length) {
        throw Error("Invalid seed value");
      }
      this.#a = e[0];
      this.#i = e[1];
      this.#s = e[2];
      this.#c = e[3];
      super.setSeed(e);
    }
  }
  class Qo extends Jo {
    static [Symbol.hasInstance](e) {
      return Jo[Symbol.hasInstance](e);
    }
    constructor(e, t) {
      super(t);
      switch (e || "mulberry32") {
        case "sfc32":
          return new Xo(t);
        case "splitmix32":
          return new Ko(t);
        case "mulberry32":
          return new Zo(t);
        case "xoshiro128":
          return new Yo(t);
        default:
          if (new.target === Qo) {
            throw Error("Unsupported algorithm: " + e);
          }
      }
    }
  }
  const $o = {
    encode: e => {
      const t = [Uint8Array.of(128, 99, 98, 106, 102, 2)];
      let n = 6;
      const r = e => {
        switch (typeof e) {
          case "undefined":
            t.push(0);
            n++;
            break;
          case "boolean":
            t.push(e ? 1 : 2);
            n++;
            break;
          case "string":
            {
              const r = Do.encode(e);
              const o = r.byteLength;
              t.push(Uint8Array.of(101, 255 & o, o >> 8 & 255, o >> 16 & 255, o >> 24 & 255), r);
              n += o + 5;
            }
            break;
          case "number":
            {
              if (Number.isSafeInteger(e)) {
                if (e >= 0) {
                  if (e < 256) {
                    t.push(Uint8Array.of(10, e));
                    return void (n += 2);
                  }
                  if (e < 65536) {
                    t.push(Uint8Array.of(11, 255 & e, e >> 8 & 255));
                    return void (n += 3);
                  }
                  if (e < 4294967296) {
                    t.push(Uint8Array.of(12, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255));
                    return void (n += 5);
                  }
                } else {
                  if (e >= -128 && e < 128) {
                    t.push(Uint8Array.of(20, e));
                    return void (n += 2);
                  }
                  if (e >= -32768 && e < 32768) {
                    t.push(Uint8Array.of(21, 255 & e, e >> 8 & 255));
                    return void (n += 3);
                  }
                  if (e >= -2147483648 && e < 2147483648) {
                    t.push(Uint8Array.of(22, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255));
                    return void (n += 5);
                  }
                }
              }
              const r = new ArrayBuffer(9);
              {
                const t = new DataView(r, 0, 9);
                t.setUint8(0, 33);
                t.setFloat64(1, e, true);
              }
              t.push(new Uint8Array(r, 0, 9));
              n += 9;
            }
            break;
          case "bigint":
            {
              const r = new ArrayBuffer(9);
              {
                const t = new DataView(r, 0, 9);
                if (e >= 0n) {
                  t.setUint8(0, 13);
                  t.setBigUint64(1, e, true);
                } else {
                  t.setUint8(0, 23);
                  t.setBigInt64(1, e, true);
                }
              }
              t.push(new Uint8Array(r, 0, 9));
              n += 9;
            }
            break;
          case "object":
            if (null === e) {
              t.push(255);
              n++;
            } else if (Array.isArray(e)) {
              const o = e.length;
              t.push(Uint8Array.of(99, 255 & o, o >> 8 & 255, o >> 16 & 255, o >> 24 & 255));
              n += 5;
              for (const t of e) r(t);
            } else if (Xe(e)) {
              const r = new Uint8Array(e, 0, e.byteLength);
              const o = r.byteLength;
              t.push(Uint8Array.of(102, 255 & o, o >> 8 & 255, o >> 16 & 255, o >> 24 & 255), r);
              n += o + 5;
            } else if (ArrayBuffer.isView(e)) {
              const r = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
              const o = r.byteLength;
              t.push(Uint8Array.of(102, 255 & o, o >> 8 & 255, o >> 16 & 255, o >> 24 & 255), r);
              n += o + 5;
            } else {
              const o = Object.keys(e);
              const a = o.length;
              t.push(Uint8Array.of(100, 255 & a, a >> 8 & 255, a >> 16 & 255, a >> 24 & 255));
              n += 5;
              for (const a of o) {
                const o = e[a];
                switch (typeof o) {
                  case "bigint":
                  case "number":
                  case "object":
                  case "string":
                  case "boolean":
                  case "undefined":
                    {
                      const e = Do.encode(a);
                      const r = e.byteLength;
                      t.push(Uint8Array.of(255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255), e);
                      n += r + 4;
                    }
                    r(o);
                }
              }
            }
        }
      };
      r(e);
      const o = new Uint8Array(n);
      let a = 0;
      for (const e of t) if ("number" != typeof e) {
        o.set(e, a);
        a += e.byteLength;
      } else {
        o[a++] = e;
      }
      return o;
    },
    decode: e => {
      if (!ArrayBuffer.isView(e)) {
        throw Error("invalid input value");
      }
      if (128 !== e[0] || 99 !== e[1] || 98 !== e[2] || 106 !== e[3] || 102 !== e[4] || 2 !== e[5]) {
        throw Error("Parse Error: Invalid magic value");
      }
      const t = new DataView(e.buffer, e.byteOffset, e.byteLength);
      let n = 6;
      const r = () => (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
      const o = () => {
        const a = e[n++];
        switch (a) {
          case 0:
            return;
          case 255:
            return null;
          case 1:
            return true;
          case 2:
            return false;
          case 10:
            return e[n++];
          case 11:
            return 255 & e[n++] | (255 & e[n++]) << 8;
          case 12:
            return (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
          case 13:
            return t.getBigUint64((n += 8) - 8, true);
          case 20:
            return e[n++] << 24 >> 24;
          case 21:
            return (255 & e[n++] | (255 & e[n++]) << 8) << 16 >> 16;
          case 22:
            return 255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24;
          case 23:
            return t.getBigInt64((n += 8) - 8, true);
          case 32:
            return t.getFloat32((n += 4) - 4, true);
          case 33:
            return t.getFloat64((n += 8) - 8, true);
          case 99:
            {
              const e = (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
              const t = Array(e);
              for (let n = 0; n < e; n++) {
                t[n] = o();
              }
              return t;
            }
          case 100:
            {
              const t = (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
              const a = Object.create(null);
              for (let i = 0; i < t; i++) {
                const t = (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
                a[Do.decode(e.subarray(n, n += t))] = o();
              }
              return a;
            }
          case 102:
            {
              const t = (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
              return e.subarray(n, n += t);
            }
          case 101:
            {
              const t = (255 & e[n++] | (255 & e[n++]) << 8 | (255 & e[n++]) << 16 | (255 & e[n++]) << 24) >>> 0;
              return Do.decode(e.subarray(n, n += t));
            }
          default:
            throw Error("Parse Error: Invalid data ID: " + a);
        }
      };
      return o();
    }
  };
  const ea = Object.freeze(Object.setPrototypeOf($o, null));
  const ta = {
    md5: function (e) {
      let t;
      let n;
      let r;
      let o;
      let a;
      let i = 1732584193;
      let s = -271733879;
      let c = -1732584194;
      let l = 271733878;
      const d = 16 * (1 + (e.length + 8 >> 6));
      const u = Array(d).fill(0);
      for (t = 0; t < e.length; t++) {
        u[t >> 2] |= e.charCodeAt(t) << t % 4 * 8;
      }
      u[t >> 2] |= 128 << t % 4 * 8;
      u[d - 2] = 8 * e.length;
      for (t = 0; t < d; t += 16) {
        n = i;
        r = s;
        o = c;
        a = l;
        i = Io(s & c | ~s & l, i, s, u[t + 0], 7, -680876936);
        l = Io(i & s | ~i & c, l, i, u[t + 1], 12, -389564586);
        c = Io(l & i | ~l & s, c, l, u[t + 2], 17, 606105819);
        s = Io(c & l | ~c & i, s, c, u[t + 3], 22, -1044525330);
        i = Io(s & c | ~s & l, i, s, u[t + 4], 7, -176418897);
        l = Io(i & s | ~i & c, l, i, u[t + 5], 12, 1200080426);
        c = Io(l & i | ~l & s, c, l, u[t + 6], 17, -1473231341);
        s = Io(c & l | ~c & i, s, c, u[t + 7], 22, -45705983);
        i = Io(s & c | ~s & l, i, s, u[t + 8], 7, 1770035416);
        l = Io(i & s | ~i & c, l, i, u[t + 9], 12, -1958414417);
        c = Io(l & i | ~l & s, c, l, u[t + 10], 17, -42063);
        s = Io(c & l | ~c & i, s, c, u[t + 11], 22, -1990404162);
        i = Io(s & c | ~s & l, i, s, u[t + 12], 7, 1804603682);
        l = Io(i & s | ~i & c, l, i, u[t + 13], 12, -40341101);
        c = Io(l & i | ~l & s, c, l, u[t + 14], 17, -1502002290);
        s = Io(c & l | ~c & i, s, c, u[t + 15], 22, 1236535329);
        i = Io(s & l | c & ~l, i, s, u[t + 1], 5, -165796510);
        l = Io(i & c | s & ~c, l, i, u[t + 6], 9, -1069501632);
        c = Io(l & s | i & ~s, c, l, u[t + 11], 14, 643717713);
        s = Io(c & i | l & ~i, s, c, u[t + 0], 20, -373897302);
        i = Io(s & l | c & ~l, i, s, u[t + 5], 5, -701558691);
        l = Io(i & c | s & ~c, l, i, u[t + 10], 9, 38016083);
        c = Io(l & s | i & ~s, c, l, u[t + 15], 14, -660478335);
        s = Io(c & i | l & ~i, s, c, u[t + 4], 20, -405537848);
        i = Io(s & l | c & ~l, i, s, u[t + 9], 5, 568446438);
        l = Io(i & c | s & ~c, l, i, u[t + 14], 9, -1019803690);
        c = Io(l & s | i & ~s, c, l, u[t + 3], 14, -187363961);
        s = Io(c & i | l & ~i, s, c, u[t + 8], 20, 1163531501);
        i = Io(s & l | c & ~l, i, s, u[t + 13], 5, -1444681467);
        l = Io(i & c | s & ~c, l, i, u[t + 2], 9, -51403784);
        c = Io(l & s | i & ~s, c, l, u[t + 7], 14, 1735328473);
        s = Io(c & i | l & ~i, s, c, u[t + 12], 20, -1926607734);
        i = Io(s ^ c ^ l, i, s, u[t + 5], 4, -378558);
        l = Io(i ^ s ^ c, l, i, u[t + 8], 11, -2022574463);
        c = Io(l ^ i ^ s, c, l, u[t + 11], 16, 1839030562);
        s = Io(c ^ l ^ i, s, c, u[t + 14], 23, -35309556);
        i = Io(s ^ c ^ l, i, s, u[t + 1], 4, -1530992060);
        l = Io(i ^ s ^ c, l, i, u[t + 4], 11, 1272893353);
        c = Io(l ^ i ^ s, c, l, u[t + 7], 16, -155497632);
        s = Io(c ^ l ^ i, s, c, u[t + 10], 23, -1094730640);
        i = Io(s ^ c ^ l, i, s, u[t + 13], 4, 681279174);
        l = Io(i ^ s ^ c, l, i, u[t + 0], 11, -358537222);
        c = Io(l ^ i ^ s, c, l, u[t + 3], 16, -722521979);
        s = Io(c ^ l ^ i, s, c, u[t + 6], 23, 76029189);
        i = Io(s ^ c ^ l, i, s, u[t + 9], 4, -640364487);
        l = Io(i ^ s ^ c, l, i, u[t + 12], 11, -421815835);
        c = Io(l ^ i ^ s, c, l, u[t + 15], 16, 530742520);
        s = Io(c ^ l ^ i, s, c, u[t + 2], 23, -995338651);
        i = Io(c ^ (s | ~l), i, s, u[t + 0], 6, -198630844);
        l = Io(s ^ (i | ~c), l, i, u[t + 7], 10, 1126891415);
        c = Io(i ^ (l | ~s), c, l, u[t + 14], 15, -1416354905);
        s = Io(l ^ (c | ~i), s, c, u[t + 5], 21, -57434055);
        i = Io(c ^ (s | ~l), i, s, u[t + 12], 6, 1700485571);
        l = Io(s ^ (i | ~c), l, i, u[t + 3], 10, -1894986606);
        c = Io(i ^ (l | ~s), c, l, u[t + 10], 15, -1051523);
        s = Io(l ^ (c | ~i), s, c, u[t + 1], 21, -2054922799);
        i = Io(c ^ (s | ~l), i, s, u[t + 8], 6, 1873313359);
        l = Io(s ^ (i | ~c), l, i, u[t + 15], 10, -30611744);
        c = Io(i ^ (l | ~s), c, l, u[t + 6], 15, -1560198380);
        s = Io(l ^ (c | ~i), s, c, u[t + 13], 21, 1309151649);
        i = Io(c ^ (s | ~l), i, s, u[t + 4], 6, -145523070);
        l = Io(s ^ (i | ~c), l, i, u[t + 11], 10, -1120210379);
        c = Io(i ^ (l | ~s), c, l, u[t + 2], 15, 718787259);
        s = Io(l ^ (c | ~i), s, c, u[t + 9], 21, -343485551);
        i = Lo(i, n);
        s = Lo(s, r);
        c = Lo(c, o);
        l = Lo(l, a);
      }
      return So(i) + So(s) + So(c) + So(l);
    },
    Hex: Vo,
    Null: mo,
    NTON: ea,
    ASCII: No,
    UTF_8: Do,
    Base32: ko,
    Base64: To,
    Buffer: ho,
    Random: Qo,
    Stream: go,
    UTF16BE: Uo,
    UTF16LE: Ro,
    UTF32BE: Wo,
    UTF32LE: Ro,
    cyrb128: function (e) {
      let t = 1779033703;
      let n = 3144134277;
      let r = 1013904242;
      let o = 2773480762;
      for (let a = 0; a < e.length; a++) {
        let i = e.charCodeAt(a);
        t = n ^ Math.imul(t ^ i, 597399067);
        n = r ^ Math.imul(n ^ i, 2869860233);
        r = o ^ Math.imul(r ^ i, 951274213);
        o = t ^ Math.imul(o ^ i, 2716044179);
      }
      t = Math.imul(r ^ t >>> 18, 597399067);
      n = Math.imul(o ^ n >>> 22, 2869860233);
      r = Math.imul(t ^ r >>> 17, 951274213);
      o = Math.imul(n ^ o >>> 19, 2716044179);
      t ^= n ^ r ^ o;
      n ^= t;
      r ^= t;
      o ^= t;
      return [t >>> 0, n >>> 0, r >>> 0, o >>> 0];
    },
    AsyncLock: class extends mo {
      #d = false;
      #u = [];
      get locked() {
        return this.#d;
      }
      then(e) {
        if ("function" == typeof e) {
          if (this.#d) {
            this.#u.push(e);
          } else {
            e();
          }
        }
      }
      lock() {
        this.#d = true;
      }
      unlock() {
        const e = this.#u;
        for (const t of e) t();
        e.length = 0;
        this.#d = false;
      }
    },
    ReadStream: bo,
    WriteStream: yo,
    EventEmitter: class extends mo {
      #h = Object.create(null);
      on(e, t) {
        const n = this.#h[e] ||= [];
        for (const e of n) if (e.$ === t) {
          return void (e.m = false);
        }
        n.push({
          $: t,
          m: false
        });
      }
      once(e, t) {
        const n = this.#h[e] ||= [];
        for (const e of n) if (e.$ === t) {
          return void (e.m = true);
        }
        n.push({
          $: t,
          m: true
        });
      }
      off(e, t) {
        const n = this.#h;
        if (null != e) {
          const r = n[e];
          if (null != r && r.length > 0) {
            if (null != t) {
              for (let e = 0; e < r.length; e++) {
                if (r[e].$ === t) {
                  r.splice(e, 1);
                  return true;
                }
              }
              return false;
            }
            return delete n[e];
          }
          return false;
        }
        if (null != t) {
          let e = false;
          for (const r of Reflect.ownKeys(n)) {
            const o = n[r];
            if (null != o) {
              e: for (let n = 0; n < o.length; n++) {
                if (o[n].$ === t) {
                  o.splice(n, 1);
                  e = true;
                  break e;
                }
              }
            }
          }
          return e;
        }
        let r = false;
        for (const e of Object.keys(n)) if (delete n[e]) {
          r = true;
        }
        return r;
      }
      emit(e, ...t) {
        const n = this.#h[e];
        if (null != n) {
          let e = false;
          for (let r = 0; r < n.length; r++) {
            const o = n[r];
            e = true;
            if (o.m) {
              n.splice(r--, 1);
            }
            Reflect.apply(o.$, this, t);
          }
          return e;
        }
        return false;
      }
      getListeners(e) {
        if (null != e) {
          return this.#h[e]?.map(e => e.$) || [];
        }
        const t = this.#h;
        const n = new Set();
        for (const e of Reflect.ownKeys(t)) {
          const r = t[e];
          if (null != r) {
            for (const e of r) n.add(e.$);
          }
        }
        return Array.from(n);
      }
    },
    SecureRandom: class extends Jo {
      constructor(e) {
        super("number" == typeof (e ||= Math.floor(4294967296 * Math.random())) ? e = [e] : e);
        this.setSeed(e);
      }
      #p = Array(256);
      #f = Array(256);
      #m = 0;
      #g = 0;
      #b = 0;
      #y = 0;
      #v(e, t) {
        const n = (65535 & e) + (65535 & t);
        return (e >>> 16) + (t >>> 16) + (n >>> 16) << 16 | 65535 & n;
      }
      #w(e) {
        let t;
        let n;
        for (e = "number" == typeof e ? Math.abs(Math.floor(e)) : 1; e--;) {
          this.#b = this.#v(this.#b, 1);
          this.#g = this.#v(this.#g, this.#b);
          for (let e = 0; e < 256; e++) {
            switch (3 & e) {
              case 0:
                this.#m ^= this.#m << 13;
                break;
              case 1:
                this.#m ^= this.#m >>> 6;
                break;
              case 2:
                this.#m ^= this.#m << 2;
                break;
              case 3:
                this.#m ^= this.#m >>> 16;
            }
            this.#m = this.#v(this.#p[e + 128 & 255], this.#m);
            t = this.#p[e];
            this.#p[e] = n = this.#v(this.#p[t >>> 2 & 255], this.#v(this.#m, this.#g));
            this.#f[e] = this.#g = this.#v(this.#p[n >>> 10 & 255], t);
          }
        }
      }
      rand() {
        if (!this.#y--) {
          this.#w();
          this.#y = 255;
        }
        return (this.#f[this.#y] >>> 0) / 4294967296;
      }
      reset() {
        this.#m = this.#g = this.#b = this.#y = 0;
        this.#p.fill(0, 0, 256);
        this.#f.fill(0, 0, 256);
      }
      setSeed(e) {
        let t;
        let n;
        let r;
        let o;
        let a;
        let i;
        let s;
        let c;
        t = n = r = o = a = i = s = c = 2654435769;
        if ("number" == typeof e) {
          e = [e];
        }
        if (!Array.isArray(e)) {
          e = [0];
        }
        this.reset();
        const l = this.#f;
        const d = this.#p;
        for (let t = 0; t < e.length; t++) {
          l[255 & t] += "number" == typeof e[t] ? e[t] : 0;
        }
        const u = () => {
          t ^= n << 11;
          o = this.#v(o, t);
          n = this.#v(n, r);
          n ^= r >>> 2;
          a = this.#v(a, n);
          r = this.#v(r, o);
          r ^= o << 8;
          i = this.#v(i, r);
          o = this.#v(o, a);
          o ^= a >>> 16;
          s = this.#v(s, o);
          a = this.#v(a, i);
          a ^= i << 10;
          c = this.#v(c, a);
          i = this.#v(i, s);
          i ^= s >>> 4;
          t = this.#v(t, i);
          s = this.#v(s, c);
          s ^= c << 8;
          n = this.#v(n, s);
          c = this.#v(c, t);
          c ^= t >>> 9;
          r = this.#v(r, c);
          t = this.#v(t, n);
        };
        for (let e = 0; e < 4; e++) {
          u();
        }
        for (let e = 0; e < 256; e += 8) {
          t = this.#v(t, l[e + 0]);
          n = this.#v(n, l[e + 1]);
          r = this.#v(r, l[e + 2]);
          o = this.#v(o, l[e + 3]);
          a = this.#v(a, l[e + 4]);
          i = this.#v(i, l[e + 5]);
          s = this.#v(s, l[e + 6]);
          c = this.#v(c, l[e + 7]);
          u();
          d[e + 0] = t;
          d[e + 1] = n;
          d[e + 2] = r;
          d[e + 3] = o;
          d[e + 4] = a;
          d[e + 5] = i;
          d[e + 6] = s;
          d[e + 7] = c;
        }
        for (let e = 0; e < 256; e += 8) {
          t = this.#v(t, d[e + 0]);
          n = this.#v(n, d[e + 1]);
          r = this.#v(r, d[e + 2]);
          o = this.#v(o, d[e + 3]);
          a = this.#v(a, d[e + 4]);
          i = this.#v(i, d[e + 5]);
          s = this.#v(s, d[e + 6]);
          c = this.#v(c, d[e + 7]);
          u();
          d[e + 0] = t;
          d[e + 1] = n;
          d[e + 2] = r;
          d[e + 3] = o;
          d[e + 4] = a;
          d[e + 5] = i;
          d[e + 6] = s;
          d[e + 7] = c;
        }
        this.#w();
        this.#y = 256;
      }
    },
    BufferReadStream: class extends bo {
      #k;
      #C;
      constructor(e, t) {
        super();
        this.#k = t || 0;
        this.#C = e;
      }
      read() {
        return this.#C[this.#k++];
      }
      readBuf(e) {
        const t = this.#C.subarray(this.#k, this.#k += e.byteLength);
        e.set(t, 0);
        return t.byteLength;
      }
      readNBytes(e) {
        return this.#C.subarray(this.#k, this.#k += e);
      }
      setIndex(e) {
        this.#k = e;
      }
      setBuffer(e) {
        this.#C = e;
      }
      get closed() {
        return false;
      }
      close() {}
    },
    BufferWriteStream: class extends yo {
      #E = [];
      #A = 0;
      write(e) {
        if ("number" == typeof e) {
          this.#E.push(e);
          this.#A++;
        } else {
          this.#E.push(e);
          this.#A += e.byteLength;
        }
      }
      toBuffer() {
        const e = new Uint8Array(this.#A);
        let t = 0;
        for (const n of this.#E) if ("number" != typeof n) {
          e.set(n, t);
          t += n.byteLength;
        } else {
          e[t++] = n;
        }
        return e;
      }
      get closed() {
        return false;
      }
      flush() {}
      close() {}
    }
  };
  Object.setPrototypeOf(ta, null);
  Object.defineProperty(ta, "NettleWeb", {
    value: ta,
    writable: false,
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(ta, Symbol.toStringTag, {
    value: "NettleWeb",
    writable: false,
    enumerable: false,
    configurable: false
  });
  const na = Object.freeze(ta);
  const ra = "object" == typeof globalThis ? globalThis : "object" == typeof window ? window : "object" == typeof global ? global : "object" == typeof self ? self : Function("return this;")();
  if (null == ra || "object" != typeof ra) {
    throw Error("Failed to resolve global object");
  }
  if (!("NettleWeb" in ra)) {
    Object.defineProperty(ra, "NettleWeb", {
      value: na,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  const aa = [.2, 0.375, 0.5555555555555556, 0.6666666666666666];
  const ia = (e, t) => n => {
    const r = 4 * e + n - 4;
    const o = "*-04-39?2$%%$%%'$%''%'''%')(%'))%(++'(++'(+.'+-.',/3',33)-/5)-43).36)058*18<+37<+4:<,4:E,5<A-7>C/8@F/:EH/<EK0=FM1?IP2@KS3BNV4DPY5FS\\6HV_6IXb7K[e8N^i9Pam;Rdp<Tgt".charCodeAt(r) - 35;
    const a = r > 8 ? o : 1;
    const i = t / a | 0;
    const s = t % a;
    const c = a - s;
    const l = r > 8 ? i * aa[n] + (e > 5) & -2 : o;
    const d = i - l;
    return {
      t: 8 * (c * d + s * (d + 1)),
      o: s ? [[c, d], [s, d + 1]] : [[c, d]],
      i: l
    };
  };
  const la = e => new Uint8Array(e);
  const da = e => {
    const t = Error("lean-qr error " + e);
    t.code = e;
    throw t;
  };
  const ua = e => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(e);
  const ha = e => e.charCodeAt(0);
  const pa = (...e) => (t, n) => e.forEach(e => e(t, n));
  const fa = e => t => {
    if (t.eci !== e) {
      t.push(7, 4);
      t.push(e, 8);
      t.eci = e;
    }
  };
  const ma = e => (t, n) => {
    t.push(4, 4);
    t.push(e.length, 8 + 8 * (n > 9));
    e.forEach(e => t.push(e, 8));
  };
  const ga = (e, t, n, r, o = (e, t) => n(e.length, t), a = r ? t => pa(fa(r), e(t)) : e) => (a.test = t, a.l = n, a.est = o, a.eci = r && [r], a);
  const ba = ga(e => (t, n) => {
    t.push(1, 4);
    t.push(e.length, 10 + 2 * (n > 26) + 2 * (n > 9));
    let r = 0;
    for (; r < e.length - 2; r += 3) {
      t.push(+e.slice(r, r + 3), 10);
    }
    if (r < e.length - 1) {
      t.push(+e.slice(r, r + 2), 7);
    } else if (r < e.length) {
      t.push(+e[r], 4);
    }
  }, /./.test.bind(/[0-9]/), (e, t) => 14 + 2 * (t > 26) + 2 * (t > 9) + 10 * e / 3);
  const ya = ga(e => (t, n) => {
    t.push(2, 4);
    t.push(e.length, 9 + 2 * (n > 26) + 2 * (n > 9));
    let r = 0;
    for (; r < e.length - 1; r += 2) {
      t.push(45 * "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(e[r]) + "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(e[r + 1]), 11);
    }
    if (r < e.length) {
      t.push("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(e[r]), 6);
    }
  }, e => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".indexOf(e) >= 0, (e, t) => 13 + 2 * (t > 26) + 2 * (t > 9) + 5.5 * e);
  const va = ga(e => ma([...e].map(ha)), e => e.charCodeAt(0) < 128, (e, t) => 12 + 8 * (t > 9) + 8 * e);
  va.u = true;
  const wa = ga(va, e => e.charCodeAt(0) < 256, va.l, 3);
  wa.u = true;
  const ka = new TextEncoder();
  const Ca = ga(e => ma(ka.encode(e)), () => 1, 0, 26, (e, t) => 12 + 8 * (t > 9) + 8 * ka.encode(e).length);
  Ca.u = true;
  let Ea = () => {
    const e = new Map();
    const t = new TextDecoder("sjis");
    const n = new Uint8Array(2);
    for (let r = 0; r < 7973; ++r) {
      n[0] = r / 192 + 129 + 64 * (r > 5951);
      n[1] = r % 192 + 64;
      e.set(t.decode(n), r);
    }
    e.delete("\ufffd");
    Ea = () => e;
    return e;
  };
  const Aa = ga(e => (t, n) => {
    t.push(8, 4);
    t.push(e.length, 8 + 2 * (n > 26) + 2 * (n > 9));
    for (const n of e) t.push(Ea().get(n), 13);
  }, e => Ea().has(e), (e, t) => 12 + 2 * (t > 26) + 2 * (t > 9) + 13 * e);
  Aa.u = true;
  const Ta = [ba, ya, va, wa, Aa, Ca];
  const xa = (e, {
    modes: t = Ta
  } = {}) => (n, r) => {
    let o = 1;
    for (const n of t) {
      const t = new Map();
      n._ = o <<= 1;
      n.m = n.est("", r);
      n.h = n.l ? (e, o) => {
        const a = o - e;
        const i = t.get(a) ?? n.l(a, r);
        t.set(a, i);
        return i;
      } : (o, a) => {
        const i = e.slice(o, a);
        const s = t.get(i) ?? n.est(i, r);
        t.set(i, s);
        return s;
      };
    }
    let a = [{
      S: 0
    }];
    let i = 0;
    let s = 0;
    let c = -1;
    for (const n of [...e, ""]) {
      let e = 0;
      if (n) {
        for (const r of t) if (r.test(n)) {
          e |= r._;
        }
      }
      if (!n || e !== c) {
        if (-1 !== c) {
          const e = new Set(a.map(e => e.v));
          const n = [];
          for (const r of t.filter(e => c & e._)) {
            const t = r.h(i, s);
            for (const o of r.eci ?? e) {
              if (r === va && o) {
                continue;
              }
              let e;
              for (const n of a) if (n.v === o || r.eci) {
                const a = n.C === r && n.v === o;
                const c = a ? n.D : n;
                const l = a ? n.V : i;
                let d;
                d = r.u && a ? n.S + t - r.m : c.S + 12 * (c.v !== o) + (l === i ? t : r.h(l, s));
                if (!e || d < e.S) {
                  e = {
                    V: l,
                    D: c,
                    C: r,
                    v: o,
                    $: s,
                    S: d
                  };
                }
              }
              if (e) {
                n.push(e);
              }
            }
          }
          if (!n.length) {
            da(5);
          }
          a = n;
        }
        c = e;
        i = s;
      }
      s += n.length;
    }
    const l = [];
    for (let t = a.reduce((e, t) => t.S < e.S ? t : e); t.C; t = t.D) {
      l.unshift(t.C(e.slice(t.V, t.$)));
    }
    l.forEach(e => e(n, r));
  };
  const Sa = () => ({
    A: new Uint8Array(2956),
    F: 0,
    push(e, t) {
      let n = t;
      for (let r = 8 - (7 & this.F); n > 0; n -= r, r = 8) {
        this.A[this.F >> 3] |= e << r >> n;
        this.F += n < r ? n : r;
      }
    }
  });
  const La = (e, t = e * e, n = new Uint8Array(t)) => ({
    size: e,
    I: n,
    get: (t, r) => t >= 0 && t < e && !!(1 & n[r * e + t]),
    K(t, r, o) {
      n[r * e + t] = o;
    },
    toString({
      on: t = "##",
      off: n = "  ",
      lf: r = "\n",
      padX: o = 4,
      padY: a = 4
    } = {}) {
      let i = "";
      for (let s = -a; s < e + a; ++s) {
        for (let r = -o; r < e + o; ++r) {
          i += this.get(r, s) ? t : n;
        }
        i += r;
      }
      return i;
    },
    toImageData(t, {
      on: n = [0, 0, 0],
      off: r = [0, 0, 0, 0],
      padX: o = 4,
      padY: a = 4
    } = {}) {
      const i = e + 2 * o;
      const s = e + 2 * a;
      const c = t.createImageData(i, s);
      const l = new Uint32Array(c.data.buffer);
      c.data.set([...n, 255]);
      const d = l[0];
      c.data.set([...r, 255]);
      const u = l[0];
      for (let e = 0; e < s; ++e) {
        for (let t = 0; t < i; ++t) {
          l[e * i + t] = this.get(t - o, e - a) ? d : u;
        }
      }
      return c;
    },
    toCanvas(e, t) {
      const n = e.getContext("2d");
      const r = this.toImageData(n, t);
      e.width = r.width;
      e.height = r.height;
      n.putImageData(r, 0, 0);
    },
    toDataURL({
      type: e = "image/png",
      scale: t = 1,
      ...n
    } = {}) {
      const r = document.createElement("canvas");
      const o = r.getContext("2d");
      const a = this.toImageData(o, n);
      r.width = a.width * t;
      r.height = a.height * t;
      o.putImageData(a, 0, 0);
      o.imageSmoothingEnabled = false;
      o.globalCompositeOperation = "copy";
      o.drawImage(r, 0, 0, a.width, a.height, 0, 0, r.width, r.height);
      return r.toDataURL(e, 1);
    }
  });
  const Ia = [(e, t) => !(1 & (e ^ t)), (e, t) => !(1 & t), e => !(e % 3), (e, t) => !((e + t) % 3), (e, t) => !(1 & (e / 3 ^ t >> 1)), (e, t) => !((e & t & 1) + e * t % 3), (e, t) => !((e & t & 1) + e * t % 3 & 1), (e, t) => !((1 & (e ^ t)) + e * t % 3 & 1)];
  const ja = new Uint8Array(512);
  ja[0] = 1;
  let e = 0;
  for (let t = 1; e < 255; ja[++e] = t) {
    ja[t + 256] = e;
    t *= 2;
    if (256 & t) {
      t ^= 285;
    }
  }
  const Ma = e => ja[e % 255];
  const _a = e => ja[e + 256];
  const Oa = (e, t) => {
    const n = new Uint8Array(e.length + t.length - 1);
    for (let r = 0; r < e.length; ++r) {
      for (let o = 0; o < t.length; ++o) {
        n[r + o] ^= ja[(e[r] + t[o]) % 255];
      }
    }
    return n.map(_a);
  };
  const Pa = (e, t) => {
    const n = new Uint8Array(e.length + t.length - 1);
    n.set(e, 0);
    for (let r = 0; r < e.length; ++r) {
      if (n[r]) {
        const e = ja[n[r] + 256];
        for (let o = 0; o < t.length; ++o) {
          n[r + o] ^= ja[(t[o] + e) % 255];
        }
      }
    }
    return n.slice(e.length);
  };
  const Da = [[0], [0, 0]];
  let e = 1;
  for (let t = Da[1]; e < 30; ++e) {
    const n = Oa(t, [0, e]);
    Da.push(n);
    t = n;
  }
  const Fa = (e, t) => {
    const n = [[], []];
    let r = 0;
    let o = 0;
    for (const [a, i] of t.o) for (let s = 0; s < a; ++s, r += i) {
      const a = e.slice(r, r + i);
      n[0].push(a);
      n[1].push(Pa(a, Da[t.i]));
      o += i + t.i;
    }
    const a = new Uint8Array(o);
    let i = 0;
    for (const e of n) {
      let t;
      for (let n = 0; i !== t; ++n) {
        t = i;
        for (const t of e) if (n < t.length) {
          a[i++] = t[n];
        }
      }
    }
    return a;
  };
  const Na = (e, t, n) => {
    let r = e << n - 1;
    for (let e = 134217728; e; e >>= 1) {
      if (r & e) {
        r ^= t * (e >> n - 1);
      }
    }
    return r;
  };
  const Ba = ({
    size: e,
    I: t,
    K: n
  }, r) => {
    const o = (n, r, o, a, i) => {
      for (; a-- > 0;) {
        const s = (r + a) * e + n;
        t.fill(i, s, s + o);
      }
    };
    const a = (e, t) => {
      o(e - 3, t - 3, 7, 7, 3);
      o(e - 2, t - 2, 5, 5, 2);
      o(e - 1, t - 1, 3, 3, 3);
    };
    const i = (e, t) => {
      o(e - 2, t - 2, 5, 5, 3);
      o(e - 1, t - 1, 3, 3, 2);
      n(e, t, 3);
    };
    o(7, 0, 2, 9, 2);
    o(e - 8, 0, 8, 9, 2);
    for (let t = 0; t < e; ++t) {
      n(t, 6, 3 ^ 1 & t);
    }
    a(3, 3);
    a(e - 4, 3);
    if (r > 1) {
      const t = 1 + (r / 7 | 0);
      const n = 2 * ((e - 13) / t / 2 + .75 | 0);
      for (let r = 0; r < t; ++r) {
        const o = e - 7 - r * n;
        if (r) {
          i(o, 6);
        }
        for (let r = 0; r < t; ++r) {
          i(o, e - 7 - r * n);
        }
      }
    }
    if (r > 6) {
      let t = r << 12 | Na(r, 7973, 13);
      for (let o = 0; o < 6; ++o) {
        for (let r = 12; r-- > 9; t >>= 1) {
          n(e - r, o, 2 | 1 & t);
        }
      }
    }
    for (let n = 0; n < e; ++n) {
      for (let r = n; r < e; ++r) {
        t[r * e + n] = t[n * e + r];
      }
    }
    n(8, e - 8, 3);
  };
  const Ua = ({
    size: e,
    I: t
  }) => {
    const n = [];
    let r = e - 2;
    let o = e;
    for (let a = -1; r >= 0; r -= 2) {
      for (5 === r && (r = 4); o += a, -1 !== o && o !== e;) {
        const a = o * e + r;
        if (t[a + 1] < 2) {
          n.push(a + 1);
        }
        if (t[a] < 2) {
          n.push(a);
        }
      }
      a *= -1;
    }
    return n;
  };
  const Ha = ({
    I: e
  }, t, n) => t.forEach((t, r) => e[t] = n[r >> 3] >> 7 - (7 & r) & 1);
  const Ra = ({
    size: e,
    I: t,
    K: n
  }, r, o, a) => {
    for (let n = 0; n < e; ++n) {
      for (let o = 0; o < e; ++o) {
        const a = n * e + o;
        t[a] ^= r(o, n) & (t[a] >> 1 ^ 1);
      }
    }
    const i = (1 ^ a) << 3 | o;
    let s = 21522 ^ (i << 10 | Na(i, 1335, 11));
    for (let t = 8; t-- > 0; s >>= 1) {
      n(8, (t > 1 ? 7 : 8) - t, s);
      n(e - 8 + t, 8, s);
    }
    for (let t = 7; t-- > 0; s >>= 1) {
      n(t > 5 ? 7 : t, 8, s);
      n(8, e - t - 1, s);
    }
  };
  const za = ({
    size: e,
    I: t
  }, n = 0, r = 0) => {
    for (let o = 0; o < e; ++o) {
      for (let a = 0; a < 2; ++a) {
        let i;
        let s = 0;
        let c = 0;
        for (let l = 0; s < e; ++s) {
          const d = 1 & t[a ? o * e + s : s * e + o];
          r += d;
          c = (c >> 1 | 2098176) & (3047517 ^ d - 1);
          if (2049 & c) {
            n += 40;
          }
          if (d !== i) {
            l = 1;
            i = d;
          } else if (++l > 4) {
            n += l < 6 ? 3 : 1;
          }
        }
      }
      if (o) {
        let r = 1;
        let a = 1 & t[o - 1];
        for (let i = (1 & t[o]) === a; r < e; ++r) {
          const s = 1 & t[r * e + o - 1];
          const c = (1 & t[r * e + o]) === s;
          n += 3 * (i && c && a === s);
          a = s;
          i = c;
        }
      }
    }
    return n + 10 * (20 * Math.abs(r / (e * e * 2) - .5) | 0);
  };
  const Wa = [];
  const qa = (e = da(1), {
    minCorrectionLevel: t = 0,
    maxCorrectionLevel: n = 3,
    minVersion: r = 1,
    maxVersion: o = 40,
    mask: a,
    trailer: i = 60433,
    ...s
  } = {}) => {
    if (n < t) {
      da(3);
    }
    if (o < r) {
      da(2);
    }
    if ("string" == typeof e) {
      e = xa(e, s);
    }
    let s = r;
    for (let c = 0; s <= o; ++s) {
      let r = Wa[s];
      if (!r) {
        Wa[s] = r = La(4 * s + 17);
        Ba(r, s);
        r.p = Ua(r);
      }
      const o = ia(s, r.p.length >> 3);
      if (o(t).t < c) {
        continue;
      }
      const l = Sa();
      e(l, s);
      c = l.F;
      for (let e = n; e >= t; --e) {
        const t = o(e);
        if (t.t < c) {
          continue;
        }
        l.push(0, 4);
        for (l.F = l.F + 7 & -8; l.F < t.t;) {
          l.push(i, 16);
        }
        const n = La(r.size, r.I);
        Ha(n, r.p, Fa(l.A, t));
        return (Ia[a ?? -1] ? [Ia[a]] : Ia).map((t, r) => {
          const o = La(n.size, n.I);
          Ra(o, t, a ?? r, e);
          o.s = za(o);
          return o;
        }).reduce((e, t) => t.s < e.s ? t : e);
      }
    }
    da(4);
  };
  qa.with = (...e) => (t, n) => qa(t, {
    modes: [...Ta, ...e],
    ...n
  });
  var Xa = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
  var Ka = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
  var Za = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var Ya = function (e, t) {
    var n = new Uint16Array(31);
    for (var r = 0; r < 31; ++r) {
      n[r] = t += 1 << e[r - 1];
    }
    var o = new Int32Array(n[30]);
    for (r = 1; r < 30; ++r) {
      for (var a = n[r]; a < n[r + 1]; ++a) {
        o[a] = a - n[r] << 5 | r;
      }
    }
    return {
      b: n,
      r: o
    };
  };
  var Qa = Ya(Xa, 2);
  var $a = Qa.b;
  var ei = Qa.r;
  $a[28] = 258;
  ei[258] = 28;
  var ti = Ya(Ka, 0);
  var ni = ti.b;
  var ri = new Uint16Array(32768);
  for (var oi = 0; oi < 32768; ++oi) {
    var ti;
    var ni;
    var ri;
    var oi;
    var ai = (43690 & oi) >> 1 | (21845 & oi) << 1;
    ai = (61680 & (ai = (52428 & ai) >> 2 | (13107 & ai) << 2)) >> 4 | (3855 & ai) << 4;
    ri[oi] = ((65280 & ai) >> 8 | (255 & ai) << 8) >> 1;
  }
  var ii = function (e, t, n) {
    var r = e.length;
    var o = 0;
    for (var a = new Uint16Array(t); o < r; ++o) {
      if (e[o]) {
        ++a[e[o] - 1];
      }
    }
    var i;
    var s = new Uint16Array(t);
    for (o = 1; o < t; ++o) {
      s[o] = s[o - 1] + a[o - 1] << 1;
    }
    if (n) {
      i = new Uint16Array(1 << t);
      var c = 15 - t;
      for (o = 0; o < r; ++o) {
        if (e[o]) {
          var l = o << 4 | e[o];
          var d = t - e[o];
          var u = s[e[o] - 1]++ << d;
          for (var h = u | (1 << d) - 1; u <= h; ++u) {
            i[ri[u] >> c] = l;
          }
        }
      }
    } else {
      i = new Uint16Array(r);
      for (o = 0; o < r; ++o) {
        if (e[o]) {
          i[o] = ri[s[e[o] - 1]++] >> 15 - e[o];
        }
      }
    }
    return i;
  };
  var si = new Uint8Array(288);
  for (oi = 0; oi < 144; ++oi) {
    si[oi] = 8;
  }
  for (oi = 144; oi < 256; ++oi) {
    si[oi] = 9;
  }
  for (oi = 256; oi < 280; ++oi) {
    si[oi] = 7;
  }
  for (oi = 280; oi < 288; ++oi) {
    si[oi] = 8;
  }
  var ci = new Uint8Array(32);
  for (oi = 0; oi < 32; ++oi) {
    ci[oi] = 5;
  }
  var li = ii(si, 9, 1);
  var di = ii(ci, 5, 1);
  var ui = function (e) {
    var t = e[0];
    for (var n = 1; n < e.length; ++n) {
      if (e[n] > t) {
        t = e[n];
      }
    }
    return t;
  };
  var hi = function (e, t, n) {
    var r = t / 8 | 0;
    return (e[r] | e[r + 1] << 8) >> (7 & t) & n;
  };
  var pi = function (e, t) {
    var n = t / 8 | 0;
    return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >> (7 & t);
  };
  var fi = function (e) {
    return (e + 7) / 8 | 0;
  };
  var mi = function (e, t, n) {
    if (null == t || t < 0) {
      t = 0;
    }
    if (null == n || n > e.length) {
      n = e.length;
    }
    return new Uint8Array(e.subarray(t, n));
  };
  var gi = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler",, "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"];
  var bi = function (e, t, n) {
    var r = Error(t || gi[e]);
    r.code = e;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(r, bi);
    }
    if (!n) {
      throw r;
    }
    return r;
  };
  var yi = function (e, t, n, r) {
    var o = e.length;
    var a = r ? r.length : 0;
    if (!o || t.f && !t.l) {
      return n || new Uint8Array(0);
    }
    var i = !n;
    var s = i || 2 != t.i;
    var c = t.i;
    if (i) {
      n = new Uint8Array(3 * o);
    }
    var l = function (e) {
      var t = n.length;
      if (e > t) {
        var r = new Uint8Array(Math.max(2 * t, e));
        r.set(n);
        n = r;
      }
    };
    var d = t.f || 0;
    var u = t.p || 0;
    var h = t.b || 0;
    var p = t.l;
    var f = t.d;
    var m = t.m;
    var g = t.n;
    var b = 8 * o;
    do {
      if (!p) {
        d = hi(e, u, 1);
        var y = hi(e, u + 1, 3);
        u += 3;
        if (!y) {
          var v = e[(j = ((u + 7) / 8 | 0) + 4) - 4] | e[j - 3] << 8;
          var w = j + v;
          if (w > o) {
            if (c) {
              bi(0);
            }
            break;
          }
          if (s) {
            l(h + v);
          }
          n.set(e.subarray(j, w), h);
          t.b = h += v;
          t.p = u = 8 * w;
          t.f = d;
          continue;
        }
        if (1 == y) {
          p = li;
          f = di;
          m = 9;
          g = 5;
        } else if (2 == y) {
          var k = hi(e, u, 31) + 257;
          var C = hi(e, u + 10, 15) + 4;
          var E = k + hi(e, u + 5, 31) + 1;
          u += 14;
          var A = new Uint8Array(E);
          var T = new Uint8Array(19);
          for (var x = 0; x < C; ++x) {
            T[Za[x]] = hi(e, u + 3 * x, 7);
          }
          u += 3 * C;
          var S = ui(T);
          var L = (1 << S) - 1;
          var I = ii(T, S, 1);
          for (x = 0; x < E;) {
            var j;
            var M = I[hi(e, u, L)];
            u += 15 & M;
            if ((j = M >> 4) < 16) {
              A[x++] = j;
            } else {
              var _ = 0;
              var O = 0;
              for (16 == j ? (O = 3 + hi(e, u, 3), u += 2, _ = A[x - 1]) : 17 == j ? (O = 3 + hi(e, u, 7), u += 3) : 18 == j && (O = 11 + hi(e, u, 127), u += 7); O--;) {
                A[x++] = _;
              }
            }
          }
          var P = A.subarray(0, k);
          var D = A.subarray(k);
          m = ui(P);
          g = ui(D);
          p = ii(P, m, 1);
          f = ii(D, g, 1);
        } else {
          bi(1);
        }
        if (u > b) {
          if (c) {
            bi(0);
          }
          break;
        }
      }
      if (s) {
        l(h + 131072);
      }
      var F = (1 << m) - 1;
      var N = (1 << g) - 1;
      for (var B = u;; B = u) {
        var U = (_ = p[pi(e, u) & F]) >> 4;
        if ((u += 15 & _) > b) {
          if (c) {
            bi(0);
          }
          break;
        }
        if (!_) {
          bi(2);
        }
        if (U < 256) {
          n[h++] = U;
        } else {
          if (256 == U) {
            B = u;
            p = null;
            break;
          }
          var H = U - 254;
          if (U > 264) {
            var R = Xa[x = U - 257];
            H = hi(e, u, (1 << R) - 1) + $a[x];
            u += R;
          }
          var z = f[pi(e, u) & N];
          var W = z >> 4;
          if (!z) {
            bi(3);
          }
          u += 15 & z;
          D = ni[W];
          if (W > 3) {
            R = Ka[W];
            D += pi(e, u) & (1 << R) - 1;
            u += R;
          }
          if (u > b) {
            if (c) {
              bi(0);
            }
            break;
          }
          if (s) {
            l(h + 131072);
          }
          var q = h + H;
          if (h < D) {
            var V = a - D;
            var G = Math.min(D, q);
            for (V + h < 0 && bi(3); h < G; ++h) {
              n[h] = r[V + h];
            }
          }
          for (; h < q; ++h) {
            n[h] = n[h - D];
          }
        }
      }
      t.l = p;
      t.p = B;
      t.b = h;
      t.f = d;
      if (p) {
        d = 1;
        t.m = m;
        t.d = f;
        t.n = g;
      }
    } while (!d);
    return h != n.length && i ? mi(n, 0, h) : n.subarray(0, h);
  };
  var vi = new Uint8Array(0);
  var wi = "undefined" != typeof TextDecoder && new TextDecoder();
  try {
    wi.decode(vi, {
      stream: true
    });
  } catch (e) {}
  if ("function" == typeof queueMicrotask) {
    queueMicrotask;
  }
  const rippedki = {
    "_a": "%cNettleWeb.com",
    "_b": "position:relative;display:block;width:fit-content;height:fit-content;padding:5px;margin:10px auto;color:#fff;border:3px solid #0000ff;font-size:24px;font-style:normal;background:#004080;font-family:\"Ubuntu\",sans-serif;font-weight:600;line-height:24px;letter-spacing:0px;",
    "_d": "<div>A fatal error occurred while displaying the contents of this page.</div>\n<div>Please try using a different browser or network, or try again later.</div>",
    "_c": 22,
    "_e": "%cVM Dead!",
    "_f": "https://nettleweb.com/",
    "_g": "Error :(",
    "_h": "head>base[href=\"/\"]",
    "_i": "target",
    "_j": "getAttribute",
    "_k": "color:#fff;font-size:14px;font-style:normal;background:#f00;font-weight:600;line-height:14px;letter-spacing:0px;",
    "_l": "_blank",
    "_m": "querySelectorAll",
    "_n": "script",
    "_o": "querySelector",
    "_p": "a[href=\"https://nettleweb.com/\"",
    "_q": "a[href=\"https://github.com/nettleweb\"",
    "_r": "title",
    "_v": "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n<title>Page Title</title>\n</head>\n<body>\nPage Content\n</body>\n</html>",
    "_w": "Retry",
    "x": {
      "e": "i-v",
      "s": "ap",
      "p": ".co.uk",
      "y": "rstonbooks"
    },
    "q": "https",
    "r": "://",
    "b": "tun.unbioctium.com",
    "c": "O00OO0OOOO0OOOO/",
    "pages": "\n<div></div>"
  };
  const ki = Object.freeze(rippedki);
  console.log(ki);
  let Ci = "whitespider";
  const {
    p: Ei,
    s: Ai,
    y: Ti,
    e: xi
  } = ki.x;
  if (Ei && Ai && Ti) {
    Ci = Ai + xi + "3.sha" + Ti + Ei + "/";
    if (Ci.length < 10) {
      Ci = "";
    }
  }
  const Si = Ci;
  let Li;
  const Ii = Object.freeze(Object.setPrototypeOf({
    _: ({
      console: e
    }) => {
      if (null == e || "object" != typeof e) {
        throw Error("Invalid interface");
      }
      const t = Reflect.get(e, "log", undefined);
      if ("function" != typeof t) {
        throw Error("Invalid instance impl");
      }
      Li = (...e) => (Reflect.apply(t, null, e), true);
    },
    get $() {
      return Li;
    }
  }, null));
  const Mi = Object.freeze(Object.setPrototypeOf({
    length: 0,
    clear: () => {},
    setItem: () => {},
    getItem: () => null,
    removeItem: () => {}
  }, null));
  const _i = Object.create(null);
  _i.open = "0";
  _i.close = "1";
  _i.ping = "2";
  _i.pong = "3";
  _i.message = "4";
  _i.upgrade = "5";
  _i.noop = "6";
  const Oi = Object.create(null);
  Object.keys(_i).forEach(e => {
    Oi[_i[e]] = e;
  });
  const Pi = {
    type: "error",
    data: "parser error"
  };
  const Di = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob);
  const Fi = "function" == typeof ArrayBuffer;
  const Ni = e => "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer;
  const Bi = ({
    type: e,
    data: t
  }, n, r) => Di && t instanceof Blob ? n ? r(t) : Ui(t, r) : Fi && (t instanceof ArrayBuffer || ("function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer)) ? n ? r(t) : Ui(new Blob([t]), r) : r(_i[e] + (t || ""));
  const Ui = (e, t) => {
    const n = new FileReader();
    n.onload = function () {
      const e = n.result.split(",")[1];
      t("b" + (e || ""));
    };
    return n.readAsDataURL(e);
  };
  let Hi;
  const zi = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256);
  for (let e = 0; e < 64; e++) {
    zi["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(e)] = e;
  }
  const Wi = "function" == typeof ArrayBuffer;
  const qi = (e, t) => {
    if ("string" != typeof e) {
      return {
        type: "message",
        data: "blob" === t ? e instanceof Blob ? e : new Blob([e]) : e instanceof ArrayBuffer ? e : e.buffer
      };
    }
    const n = e.charAt(0);
    return "b" === n ? {
      type: "message",
      data: Vi(e.substring(1), t)
    } : Oi[n] ? e.length > 1 ? {
      type: Oi[n],
      data: e.substring(1)
    } : {
      type: Oi[n]
    } : Pi;
  };
  const Vi = (e, t) => {
    if (Wi) {
      const n = (e => {
        let t;
        let n;
        let r;
        let o;
        let a;
        let i = .75 * e.length;
        let s = e.length;
        let c = 0;
        if ("=" === e[e.length - 1]) {
          i--;
          if ("=" === e[e.length - 2]) {
            i--;
          }
        }
        const l = new ArrayBuffer(i);
        const d = new Uint8Array(l);
        for (t = 0; t < s; t += 4) {
          n = zi[e.charCodeAt(t)];
          r = zi[e.charCodeAt(t + 1)];
          o = zi[e.charCodeAt(t + 2)];
          a = zi[e.charCodeAt(t + 3)];
          d[c++] = n << 2 | r >> 4;
          d[c++] = (15 & r) << 4 | o >> 2;
          d[c++] = (3 & o) << 6 | 63 & a;
        }
        return l;
      })(e);
      return "blob" === t ? n instanceof Blob ? n : new Blob([n]) : n instanceof ArrayBuffer ? n : n.buffer;
    }
    return {
      base64: true,
      data: e
    };
  };
  const Gi = (e, t) => "blob" === t ? e instanceof Blob ? e : new Blob([e]) : e instanceof ArrayBuffer ? e : e.buffer;
  let Ji;
  nt.prototype.on = nt.prototype.addEventListener = function (e, t) {
    this._callbacks = this._callbacks || {};
    (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t);
    return this;
  };
  nt.prototype.once = function (e, t) {
    function n() {
      this.off(e, n);
      t.apply(this, arguments);
    }
    n.fn = t;
    this.on(e, n);
    return this;
  };
  nt.prototype.off = nt.prototype.removeListener = nt.prototype.removeAllListeners = nt.prototype.removeEventListener = function (e, t) {
    this._callbacks = this._callbacks || {};
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }
    var n;
    var r = this._callbacks["$" + e];
    if (!r) {
      return this;
    }
    if (1 == arguments.length) {
      delete this._callbacks["$" + e];
      return this;
    }
    for (var o = 0; o < r.length; o++) {
      if ((n = r[o]) === t || n.fn === t) {
        r.splice(o, 1);
        break;
      }
    }
    if (0 === r.length) {
      delete this._callbacks["$" + e];
    }
    return this;
  };
  nt.prototype.emit = function (e) {
    this._callbacks = this._callbacks || {};
    var t = Array(arguments.length - 1);
    var n = this._callbacks["$" + e];
    for (var r = 1; r < arguments.length; r++) {
      t[r - 1] = arguments[r];
    }
    if (n) {
      r = 0;
      for (var o = (n = n.slice(0)).length; r < o; ++r) {
        n[r].apply(this, t);
      }
    }
    return this;
  };
  nt.prototype.emitReserved = nt.prototype.emit;
  nt.prototype.listeners = function (e) {
    this._callbacks = this._callbacks || {};
    return this._callbacks["$" + e] || [];
  };
  nt.prototype.hasListeners = function (e) {
    return !!this.listeners(e).length;
  };
  const Xi = "function" == typeof Promise && "function" == typeof Promise.resolve ? e => Promise.resolve().then(e) : (e, t) => t(e, 0);
  const Ki = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this")();
  const Zi = Ki.setTimeout;
  const Yi = Ki.clearTimeout;
  class Qi extends Error {
    constructor(e, t, n) {
      super(e);
      this.description = t;
      this.context = n;
      this.type = "TransportError";
    }
  }
  class $i extends nt {
    constructor(e) {
      super();
      this.writable = false;
      ot(this, e);
      this.opts = e;
      this.query = e.query;
      this.socket = e.socket;
      this.supportsBinary = !e.forceBase64;
    }
    onError(e, t, n) {
      super.emitReserved("error", new Qi(e, t, n));
      return this;
    }
    open() {
      this.readyState = "opening";
      this.doOpen();
      return this;
    }
    close() {
      if (!("opening" !== this.readyState && "open" !== this.readyState)) {
        this.doClose();
        this.onClose();
      }
      return this;
    }
    send(e) {
      if ("open" === this.readyState) {
        this.write(e);
      }
    }
    onOpen() {
      this.readyState = "open";
      this.writable = true;
      super.emitReserved("open");
    }
    onData(e) {
      const t = qi(e, this.socket.binaryType);
      this.onPacket(t);
    }
    onPacket(e) {
      super.emitReserved("packet", e);
    }
    onClose(e) {
      this.readyState = "closed";
      super.emitReserved("close", e);
    }
    pause(e) {}
    createUri(e, t = {}) {
      return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
    }
    _hostname() {
      const e = this.opts.hostname;
      return -1 === e.indexOf(":") ? e : "[" + e + "]";
    }
    _port() {
      return this.opts.port && (this.opts.secure && Number(443 !== this.opts.port) || !this.opts.secure && 80 !== Number(this.opts.port)) ? ":" + this.opts.port : "";
    }
    _query(e) {
      const t = function (e) {
        let t = "";
        for (let n in e) if (e.hasOwnProperty(n)) {
          if (t.length) {
            t += "&";
          }
          t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]);
        }
        return t;
      }(e);
      return t.length ? "?" + t : "";
    }
  }
  class es extends $i {
    constructor() {
      super(...arguments);
      this._polling = false;
    }
    get name() {
      return "polling";
    }
    doOpen() {
      this._poll();
    }
    pause(e) {
      this.readyState = "pausing";
      const t = () => {
        this.readyState = "paused";
        e();
      };
      if (this._polling || !this.writable) {
        let e = 0;
        if (this._polling) {
          e++;
          this.once("pollComplete", function () {
            if (! --e) {
              t();
            }
          });
        }
        if (!this.writable) {
          e++;
          this.once("drain", function () {
            if (! --e) {
              t();
            }
          });
        }
      } else {
        t();
      }
    }
    _poll() {
      this._polling = true;
      this.doPoll();
      this.emitReserved("poll");
    }
    onData(e) {
      ((e, t) => {
        const n = e.split("\x1e");
        const r = [];
        for (let e = 0; e < n.length; e++) {
          const o = qi(n[e], t);
          r.push(o);
          if ("error" === o.type) {
            break;
          }
        }
        return r;
      })(e, this.socket.binaryType).forEach(e => {
        if ("opening" === this.readyState && "open" === e.type) {
          this.onOpen();
        }
        if ("close" === e.type) {
          this.onClose({
            description: "transport closed by the server"
          });
          return false;
        }
        this.onPacket(e);
      });
      if ("closed" !== this.readyState) {
        this._polling = false;
        this.emitReserved("pollComplete");
        if ("open" === this.readyState) {
          this._poll();
        }
      }
    }
    doClose() {
      const e = () => {
        this.write([{
          type: "close"
        }]);
      };
      if ("open" === this.readyState) {
        e();
      } else {
        this.once("open", e);
      }
    }
    write(e) {
      this.writable = false;
      ((e, t) => {
        const n = e.length;
        const r = Array(n);
        let o = 0;
        e.forEach((e, a) => {
          Bi(e, false, e => {
            r[a] = e;
            if (++o === n) {
              t(r.join("\x1e"));
            }
          });
        });
      })(e, e => {
        this.doWrite(e, () => {
          this.writable = true;
          this.emitReserved("drain");
        });
      });
    }
    uri() {
      const e = this.opts.secure ? "https" : "http";
      const t = this.query || {};
      if (false !== this.opts.timestampRequests) {
        t[this.opts.timestampParam] = Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
      }
      if (!(this.supportsBinary || t.sid)) {
        t.b64 = 1;
      }
      return this.createUri(e, t);
    }
  }
  let ts = false;
  try {
    ts = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
  } catch (bi) {}
  const ns = ts;
  class rs extends es {
    constructor(e) {
      super(e);
      if ("undefined" != typeof location) {
        const t = "https:" === location.protocol;
        let n = location.port;
        if (!n) {
          n = t ? "443" : "80";
        }
        this.xd = "undefined" != typeof location && e.hostname !== location.hostname || n !== e.port;
      }
    }
    doWrite(e, t) {
      const n = this.request({
        method: "POST",
        data: e
      });
      n.on("success", t);
      n.on("error", (e, t) => {
        this.onError("xhr post error", e, t);
      });
    }
    doPoll() {
      const e = this.request();
      e.on("data", this.onData.bind(this));
      e.on("error", (e, t) => {
        this.onError("xhr poll error", e, t);
      });
      this.pollXhr = e;
    }
  }
  class os extends nt {
    constructor(e, t, n) {
      super();
      this.createRequest = e;
      ot(this, n);
      this._opts = n;
      this._method = n.method || "GET";
      this._uri = t;
      this._data = undefined !== n.data ? n.data : null;
      this._create();
    }
    _create() {
      var e;
      const t = rt(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
      t.xdomain = !!this._opts.xd;
      const n = this._xhr = this.createRequest(t);
      try {
        n.open(this._method, this._uri, true);
        try {
          if (this._opts.extraHeaders) {
            if (n.setDisableHeaderCheck) {
              n.setDisableHeaderCheck(true);
            }
            for (let e in this._opts.extraHeaders) if (this._opts.extraHeaders.hasOwnProperty(e)) {
              n.setRequestHeader(e, this._opts.extraHeaders[e]);
            }
          }
        } catch (e) {}
        if ("POST" === this._method) {
          try {
            n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
          } catch (e) {}
        }
        try {
          n.setRequestHeader("Accept", "*/*");
        } catch (e) {}
        if (!(null === (e = this._opts.cookieJar) || undefined === e)) {
          e.addCookies(n);
        }
        if ("withCredentials" in n) {
          n.withCredentials = this._opts.withCredentials;
        }
        if (this._opts.requestTimeout) {
          n.timeout = this._opts.requestTimeout;
        }
        n.onreadystatechange = () => {
          var e;
          if (3 === n.readyState) {
            if (!(null === (e = this._opts.cookieJar) || undefined === e)) {
              e.parseCookies(n.getResponseHeader("set-cookie"));
            }
          }
          if (4 === n.readyState) {
            if (200 === n.status || 1223 === n.status) {
              this._onLoad();
            } else {
              this.setTimeoutFn(() => {
                this._onError("number" == typeof n.status ? n.status : 0);
              }, 0);
            }
          }
        };
        n.send(this._data);
      } catch (e) {
        return void this.setTimeoutFn(() => {
          this._onError(e);
        }, 0);
      }
      if ("undefined" != typeof document) {
        this._index = os.requestsCount++;
        os.requests[this._index] = this;
      }
    }
    _onError(e) {
      this.emitReserved("error", e, this._xhr);
      this._cleanup(true);
    }
    _cleanup(e) {
      if (undefined !== this._xhr && null !== this._xhr) {
        this._xhr.onreadystatechange = it;
        if (e) {
          try {
            this._xhr.abort();
          } catch (e) {}
        }
        if ("undefined" != typeof document) {
          delete os.requests[this._index];
        }
        this._xhr = null;
      }
    }
    _onLoad() {
      const e = this._xhr.responseText;
      if (null !== e) {
        this.emitReserved("data", e);
        this.emitReserved("success");
        this._cleanup();
      }
    }
    abort() {
      this._cleanup();
    }
  }
  os.requestsCount = 0;
  os.requests = {};
  if ("undefined" != typeof document) {
    if ("function" == typeof attachEvent) {
      attachEvent("onunload", st);
    } else if ("function" == typeof addEventListener) {
      addEventListener("onpagehide" in Ki ? "pagehide" : "unload", st, false);
    }
  }
  const as = function () {
    const e = ct({
      xdomain: false
    });
    return e && null !== e.responseType;
  }();
  const is = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase();
  class ss extends $i {
    get name() {
      return "websocket";
    }
    doOpen() {
      const e = this.uri();
      const t = this.opts.protocols;
      const n = is ? {} : rt(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
      if (this.opts.extraHeaders) {
        n.headers = this.opts.extraHeaders;
      }
      try {
        this.ws = this.createSocket(e, t, n);
      } catch (e) {
        return this.emitReserved("error", e);
      }
      this.ws.binaryType = this.socket.binaryType;
      this.addEventListeners();
    }
    addEventListeners() {
      this.ws.onopen = () => {
        if (this.opts.autoUnref) {
          this.ws._socket.unref();
        }
        this.onOpen();
      };
      this.ws.onclose = e => this.onClose({
        description: "websocket connection closed",
        context: e
      });
      this.ws.onmessage = e => this.onData(e.data);
      this.ws.onerror = e => this.onError("websocket error", e);
    }
    write(e) {
      this.writable = false;
      for (let t = 0; t < e.length; t++) {
        const n = e[t];
        const r = t === e.length - 1;
        Bi(n, this.supportsBinary, e => {
          try {
            this.doWrite(n, e);
          } catch (e) {}
          if (r) {
            Xi(() => {
              this.writable = true;
              this.emitReserved("drain");
            }, this.setTimeoutFn);
          }
        });
      }
    }
    doClose() {
      if (undefined !== this.ws) {
        this.ws.onerror = () => {};
        this.ws.close();
        this.ws = null;
      }
    }
    uri() {
      const e = this.opts.secure ? "wss" : "ws";
      const t = this.query || {};
      if (this.opts.timestampRequests) {
        t[this.opts.timestampParam] = Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
      }
      if (!this.supportsBinary) {
        t.b64 = 1;
      }
      return this.createUri(e, t);
    }
  }
  const cs = Ki.WebSocket || Ki.MozWebSocket;
  const ls = {
    websocket: class extends ss {
      createSocket(e, t, n) {
        return is ? new cs(e, t, n) : t ? new cs(e, t) : new cs(e);
      }
      doWrite(e, t) {
        this.ws.send(t);
      }
    },
    webtransport: class extends $i {
      get name() {
        return "webtransport";
      }
      doOpen() {
        try {
          this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
        } catch (e) {
          return this.emitReserved("error", e);
        }
        this._transport.closed.then(() => {
          this.onClose();
        }).catch(e => {
          this.onError("webtransport error", e);
        });
        this._transport.ready.then(() => {
          this._transport.createBidirectionalStream().then(e => {
            const t = function (e, t) {
              if (!Ji) {
                Ji = new TextDecoder();
              }
              const n = [];
              let r = 0;
              let o = -1;
              let a = false;
              return new TransformStream({
                transform(i, s) {
                  for (n.push(i);;) {
                    if (0 === r) {
                      if (et(n) < 1) {
                        break;
                      }
                      const e = tt(n, 1);
                      a = !(128 & ~e[0]);
                      o = 127 & e[0];
                      r = o < 126 ? 3 : 126 === o ? 1 : 2;
                    } else if (1 === r) {
                      if (et(n) < 2) {
                        break;
                      }
                      const e = tt(n, 2);
                      o = new DataView(e.buffer, e.byteOffset, e.length).getUint16(0);
                      r = 3;
                    } else if (2 === r) {
                      if (et(n) < 8) {
                        break;
                      }
                      const e = tt(n, 8);
                      const t = new DataView(e.buffer, e.byteOffset, e.length);
                      const a = t.getUint32(0);
                      if (a > 2097151) {
                        s.enqueue(Pi);
                        break;
                      }
                      o = 4294967296 * a + t.getUint32(4);
                      r = 3;
                    } else {
                      if (et(n) < o) {
                        break;
                      }
                      const e = tt(n, o);
                      s.enqueue(qi(a ? e : Ji.decode(e), t));
                      r = 0;
                    }
                    if (0 === o || o > e) {
                      s.enqueue(Pi);
                      break;
                    }
                  }
                }
              });
            }(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
            const n = e.readable.pipeThrough(t).getReader();
            const r = $e();
            r.readable.pipeTo(e.writable);
            this._writer = r.writable.getWriter();
            const o = () => {
              n.read().then(({
                done: e,
                value: t
              }) => {
                if (!e) {
                  this.onPacket(t);
                  o();
                }
              }).catch(() => {});
            };
            o();
            const a = {
              type: "open"
            };
            if (this.query.sid) {
              a.data = `{"sid":"${this.query.sid}"}`;
            }
            this._writer.write(a).then(() => this.onOpen());
          });
        });
      }
      write(e) {
        this.writable = false;
        for (let t = 0; t < e.length; t++) {
          const n = e[t];
          const r = t === e.length - 1;
          this._writer.write(n).then(() => {
            if (r) {
              Xi(() => {
                this.writable = true;
                this.emitReserved("drain");
              }, this.setTimeoutFn);
            }
          });
        }
      }
      doClose() {
        var e;
        if (!(null === (e = this._transport) || undefined === e)) {
          e.close();
        }
      }
    },
    polling: class extends rs {
      constructor(e) {
        super(e);
        const t = e && e.forceBase64;
        this.supportsBinary = as && !t;
      }
      request(e = {}) {
        Object.assign(e, {
          xd: this.xd
        }, this.opts);
        return new os(ct, this.uri(), e);
      }
    }
  };
  const ds = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
  const us = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
  const hs = "function" == typeof addEventListener && "function" == typeof removeEventListener;
  const ps = [];
  if (hs) {
    addEventListener("offline", () => {
      ps.forEach(e => e());
    }, false);
  }
  class fs extends nt {
    constructor(e, t) {
      super();
      this.binaryType = "arraybuffer";
      this.writeBuffer = [];
      this._prevBufferLen = 0;
      this._pingInterval = -1;
      this._pingTimeout = -1;
      this._maxPayload = -1;
      this._pingTimeoutTime = Infinity;
      if (e && "object" == typeof e) {
        t = e;
        e = null;
      }
      if (e) {
        const n = lt(e);
        t.hostname = n.host;
        t.secure = "https" === n.protocol || "wss" === n.protocol;
        t.port = n.port;
        if (n.query) {
          t.query = n.query;
        }
      } else if (t.host) {
        t.hostname = lt(t.host).host;
      }
      ot(this, t);
      this.secure = null != t.secure ? t.secure : "undefined" != typeof location && "https:" === location.protocol;
      if (t.hostname && !t.port) {
        t.port = this.secure ? "443" : "80";
      }
      this.hostname = t.hostname || ("undefined" != typeof location ? location.hostname : "localhost");
      this.port = t.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? "443" : "80");
      this.transports = [];
      this._transportsByName = {};
      t.transports.forEach(e => {
        const t = e.prototype.name;
        this.transports.push(t);
        this._transportsByName[t] = e;
      });
      this.opts = Object.assign({
        path: "/engine.io",
        agent: false,
        withCredentials: false,
        upgrade: true,
        timestampParam: "t",
        rememberUpgrade: false,
        addTrailingSlash: true,
        rejectUnauthorized: true,
        perMessageDeflate: {
          threshold: 1024
        },
        transportOptions: {},
        closeOnBeforeunload: false
      }, t);
      this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
      if ("string" == typeof this.opts.query) {
        this.opts.query = function (e) {
          let t = {};
          let n = e.split("&");
          let e = 0;
          for (let r = n.length; e < r; e++) {
            let r = n[e].split("=");
            t[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
          }
          return t;
        }(this.opts.query);
      }
      if (hs) {
        if (this.opts.closeOnBeforeunload) {
          this._beforeunloadEventListener = () => {
            if (this.transport) {
              this.transport.removeAllListeners();
              this.transport.close();
            }
          };
          addEventListener("beforeunload", this._beforeunloadEventListener, false);
        }
        if ("localhost" !== this.hostname) {
          this._offlineEventListener = () => {
            this._onClose("transport close", {
              description: "network connection lost"
            });
          };
          ps.push(this._offlineEventListener);
        }
      }
      if (this.opts.withCredentials) {
        this._cookieJar = undefined;
      }
      this._open();
    }
    createTransport(e) {
      const t = Object.assign({}, this.opts.query);
      t.EIO = 4;
      t.transport = e;
      if (this.id) {
        t.sid = this.id;
      }
      const n = Object.assign({}, this.opts, {
        query: t,
        socket: this,
        hostname: this.hostname,
        secure: this.secure,
        port: this.port
      }, this.opts.transportOptions[e]);
      return new this._transportsByName[e](n);
    }
    _open() {
      if (0 === this.transports.length) {
        return void this.setTimeoutFn(() => {
          this.emitReserved("error", "No transports available");
        }, 0);
      }
      const e = this.opts.rememberUpgrade && fs.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket") ? "websocket" : this.transports[0];
      this.readyState = "opening";
      const t = this.createTransport(e);
      t.open();
      this.setTransport(t);
    }
    setTransport(e) {
      if (this.transport) {
        this.transport.removeAllListeners();
      }
      this.transport = e;
      e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", e => this._onClose("transport close", e));
    }
    onOpen() {
      this.readyState = "open";
      fs.priorWebsocketSuccess = "websocket" === this.transport.name;
      this.emitReserved("open");
      this.flush();
    }
    _onPacket(e) {
      if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
        this.emitReserved("packet", e);
        this.emitReserved("heartbeat");
        switch (e.type) {
          case "open":
            this.onHandshake(JSON.parse(e.data));
            break;
          case "ping":
            this._sendPacket("pong");
            this.emitReserved("ping");
            this.emitReserved("pong");
            this._resetPingTimeout();
            break;
          case "error":
            const t = Error("server error");
            t.code = e.data;
            this._onError(t);
            break;
          case "message":
            this.emitReserved("data", e.data);
            this.emitReserved("message", e.data);
        }
      }
    }
    onHandshake(e) {
      this.emitReserved("handshake", e);
      this.id = e.sid;
      this.transport.query.sid = e.sid;
      this._pingInterval = e.pingInterval;
      this._pingTimeout = e.pingTimeout;
      this._maxPayload = e.maxPayload;
      this.onOpen();
      if ("closed" !== this.readyState) {
        this._resetPingTimeout();
      }
    }
    _resetPingTimeout() {
      this.clearTimeoutFn(this._pingTimeoutTimer);
      const e = this._pingInterval + this._pingTimeout;
      this._pingTimeoutTime = Date.now() + e;
      this._pingTimeoutTimer = this.setTimeoutFn(() => {
        this._onClose("ping timeout");
      }, e);
      if (this.opts.autoUnref) {
        this._pingTimeoutTimer.unref();
      }
    }
    _onDrain() {
      this.writeBuffer.splice(0, this._prevBufferLen);
      this._prevBufferLen = 0;
      if (0 === this.writeBuffer.length) {
        this.emitReserved("drain");
      } else {
        this.flush();
      }
    }
    flush() {
      if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
        const e = this._getWritablePackets();
        this.transport.send(e);
        this._prevBufferLen = e.length;
        this.emitReserved("flush");
      }
    }
    _getWritablePackets() {
      if (!(this._maxPayload && "polling" === this.transport.name && this.writeBuffer.length > 1)) {
        return this.writeBuffer;
      }
      let e = 1;
      for (let n = 0; n < this.writeBuffer.length; n++) {
        const r = this.writeBuffer[n].data;
        if (r) {
          e += "string" == typeof (t = r) ? function (e) {
            let t = 0;
            let n = 0;
            let r = 0;
            for (let o = e.length; r < o; r++) {
              t = e.charCodeAt(r);
              if (t < 128) {
                n += 1;
              } else if (t < 2048) {
                n += 2;
              } else if (t < 55296 || t >= 57344) {
                n += 3;
              } else {
                r++;
                n += 4;
              }
            }
            return n;
          }(t) : Math.ceil(1.33 * (t.byteLength || t.size));
        }
        if (n > 0 && e > this._maxPayload) {
          return this.writeBuffer.slice(0, n);
        }
        e += 2;
      }
      var t;
      return this.writeBuffer;
    }
    _hasPingExpired() {
      if (!this._pingTimeoutTime) {
        return true;
      }
      const e = Date.now() > this._pingTimeoutTime;
      if (e) {
        this._pingTimeoutTime = 0;
        Xi(() => {
          this._onClose("ping timeout");
        }, this.setTimeoutFn);
      }
      return e;
    }
    write(e, t, n) {
      this._sendPacket("message", e, t, n);
      return this;
    }
    send(e, t, n) {
      this._sendPacket("message", e, t, n);
      return this;
    }
    _sendPacket(e, t, n, r) {
      if ("function" == typeof t) {
        r = t;
        t = undefined;
      }
      if ("function" == typeof n) {
        r = n;
        n = null;
      }
      if ("closing" === this.readyState || "closed" === this.readyState) {
        return;
      }
      (n = n || {}).compress = false !== n.compress;
      const o = {
        type: e,
        data: t,
        options: n
      };
      this.emitReserved("packetCreate", o);
      this.writeBuffer.push(o);
      if (r) {
        this.once("flush", r);
      }
      this.flush();
    }
    close() {
      const e = () => {
        this._onClose("forced close");
        this.transport.close();
      };
      const t = () => {
        this.off("upgrade", t);
        this.off("upgradeError", t);
        e();
      };
      const n = () => {
        this.once("upgrade", t);
        this.once("upgradeError", t);
      };
      if (!("opening" !== this.readyState && "open" !== this.readyState)) {
        this.readyState = "closing";
        if (this.writeBuffer.length) {
          this.once("drain", () => {
            if (this.upgrading) {
              n();
            } else {
              e();
            }
          });
        } else if (this.upgrading) {
          n();
        } else {
          e();
        }
      }
      return this;
    }
    _onError(e) {
      fs.priorWebsocketSuccess = false;
      if (this.opts.tryAllTransports && this.transports.length > 1 && "opening" === this.readyState) {
        this.transports.shift();
        return this._open();
      }
      this.emitReserved("error", e);
      this._onClose("transport error", e);
    }
    _onClose(e, t) {
      if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
        this.clearTimeoutFn(this._pingTimeoutTimer);
        this.transport.removeAllListeners("close");
        this.transport.close();
        this.transport.removeAllListeners();
        if (hs && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, false), this._offlineEventListener)) {
          const e = ps.indexOf(this._offlineEventListener);
          if (-1 !== e) {
            ps.splice(e, 1);
          }
        }
        this.readyState = "closed";
        this.id = null;
        this.emitReserved("close", e, t);
        this.writeBuffer = [];
        this._prevBufferLen = 0;
      }
    }
  }
  fs.protocol = 4;
  class ms extends fs {
    constructor() {
      super(...arguments);
      this._upgrades = [];
    }
    onOpen() {
      super.onOpen();
      if ("open" === this.readyState && this.opts.upgrade) {
        for (let e = 0; e < this._upgrades.length; e++) {
          this._probe(this._upgrades[e]);
        }
      }
    }
    _probe(e) {
      function t() {
        if (!i) {
          i = true;
          l();
          a.close();
          a = null;
        }
      }
      function n() {
        c("transport closed");
      }
      function r() {
        c("socket closed");
      }
      function o(e) {
        if (a && e.name !== a.name) {
          t();
        }
      }
      let a = this.createTransport(e);
      let i = false;
      fs.priorWebsocketSuccess = false;
      const s = () => {
        if (!i) {
          a.send([{
            type: "ping",
            data: "probe"
          }]);
          a.once("packet", e => {
            if (!i) {
              if ("pong" === e.type && "probe" === e.data) {
                this.upgrading = true;
                this.emitReserved("upgrading", a);
                if (!a) {
                  return;
                }
                fs.priorWebsocketSuccess = "websocket" === a.name;
                this.transport.pause(() => {
                  if (!i) {
                    if ("closed" !== this.readyState) {
                      l();
                      this.setTransport(a);
                      a.send([{
                        type: "upgrade"
                      }]);
                      this.emitReserved("upgrade", a);
                      a = null;
                      this.upgrading = false;
                      this.flush();
                    }
                  }
                });
              } else {
                const e = Error("probe error");
                e.transport = a.name;
                this.emitReserved("upgradeError", e);
              }
            }
          });
        }
      };
      const c = e => {
        const n = Error("probe error: " + e);
        n.transport = a.name;
        t();
        this.emitReserved("upgradeError", n);
      };
      const l = () => {
        a.removeListener("open", s);
        a.removeListener("error", c);
        a.removeListener("close", n);
        this.off("close", r);
        this.off("upgrading", o);
      };
      a.once("open", s);
      a.once("error", c);
      a.once("close", n);
      this.once("close", r);
      this.once("upgrading", o);
      if (-1 !== this._upgrades.indexOf("webtransport") && "webtransport" !== e) {
        this.setTimeoutFn(() => {
          if (!i) {
            a.open();
          }
        }, 200);
      } else {
        a.open();
      }
    }
    onHandshake(e) {
      this._upgrades = this._filterUpgrades(e.upgrades);
      super.onHandshake(e);
    }
    _filterUpgrades(e) {
      const t = [];
      for (let n = 0; n < e.length; n++) {
        if (~this.transports.indexOf(e[n])) {
          t.push(e[n]);
        }
      }
      return t;
    }
  }
  class gs extends ms {
    constructor(e, t = {}) {
      const n = "object" == typeof e ? e : t;
      if (!n.transports || n.transports && "string" == typeof n.transports[0]) {
        n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map(e => ls[e]).filter(e => !!e);
      }
      super(e, n);
    }
  }
  (async ({
    window: e,
    document: t
  }) => {
    function n(e) {
      const n = t.getElementById(e);
      if (null != n) {
        return n;
      }
      throw Error("Cannot access element: " + e);
    }
    function r(e) {
      const n = t.querySelector(e);
      if (null != n) {
        return n;
      }
      throw Error("Cannot access element selector: " + e);
    }
    function o(e) {
      if (null != e) {
        I.textContent = e;
        I.style.display = "block";
      } else {
        I.style.display = "none";
      }
    }
    function a(e) {
      try {
        return new URL(e);
      } catch (e) {
        return null;
      }
    }
    function i(e) {
      for (let t = e.length - 1; t >= 0; t--) {
        const n = Math.floor(Math.random() * (t + 1));
        [e[t], e[n]] = [e[n], e[t]];
      }
      return e;
    }
    function s(e) {
      return "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(e)));
    }
    function c(e) {
      return new Date(e).toLocaleString("POSIX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    }
    async function l(t, n) {
      try {
        const r = await e.fetch(t, {
          cache: n || "force-cache",
          method: "GET"
        });
        return r.ok ? await r.text() : null;
      } catch (e) {
        return null;
      }
    }
    async function d(e, t, n) {
      try {
        const r = new Image(512, 512);
        r.loading = "eager";
        r.decoding = "sync";
        r.draggable = false;
        {
          const t = URL.createObjectURL(e);
          r.src = t;
          await r.decode();
          URL.revokeObjectURL(t);
        }
        let o = r.naturalWidth;
        let a = r.naturalHeight;
        {
          const e = null == n ? a / o : n / t;
          if (a >= o * e) {
            a = Math.floor(o * e);
          } else {
            o = Math.floor(a / e);
          }
        }
        if ((t = Math.min(t, o)) < 10 || (n = null == n ? a : Math.min(n, a)) < 10) {
          throw Error("Image must have at least 100 pixels.");
        }
        const i = new OffscreenCanvas(t, n);
        const s = i.getContext("2d", {
          alpha: false
        });
        if (null == s) {
          throw Error("Failed to initialize canvas context.");
        }
        s.imageSmoothingEnabled = true;
        s.imageSmoothingQuality = "high";
        s.drawImage(r, 0, 0, o, a, 0, 0, t, n);
        return await i.convertToBlob({
          type: "image/jpeg",
          quality: 100
        });
      } catch (e) {
        return null;
      }
    }
    async function u(t) {
      let n = 0;
      let r = 0;
      const o = [];
      for (const e of t.split(",")) {
        const t = e.split(";", 3);
        if (3 !== t.length) {
          throw Error("Invalid entry value");
        }
        const n = parseInt(t[1], 10);
        const a = parseInt(t[2], 10);
        const i = a - n;
        if (n < 0 || a < 0 || i <= 0) {
          throw Error("Invalid entry data length");
        }
        r += i;
        o.push({
          id: t[0],
          s: n,
          e: a,
          l: i
        });
      }
      const a = new Uint8Array(new ArrayBuffer(r), 0, r);
      for (const {
        id: t,
        s: r,
        e: i,
        l: s
      } of o) {
        const o = await e.fetch("/r/" + t, {
          cache: "force-cache",
          method: "GET",
          headers: {
            Range: "bytes=" + r + "-" + (i - 1)
          }
        });
        if (!o.ok) {
          throw Error("Failed to fetch resources: Remote returned error status code: " + o.status);
        }
        if (206 === o.status && o.headers.has("content-range")) {
          a.set(new Uint8Array(await o.arrayBuffer(), 0, s), n);
        } else {
          a.set(new Uint8Array(await o.arrayBuffer(), r, s), n);
        }
        n += s;
      }
      return a.buffer;
    }
    function h(e, t) {
      return new Promise((n, r) => {
        const o = new ArrayBuffer((t = na.NTON.encode(t)).byteLength + 10);
        const a = performance.now();
        {
          const n = new Uint8Array(o);
          n[0] = 3;
          n[9] = e;
          n.set(t, 10);
        }
        new DataView(o, 1, 8).setFloat64(0, a, true);
        V.send(o, {
          compress: true
        });
        R.set(a, [n, r]);
      });
    }
    function p(e) {
      j.appendChild(b(e));
      M.style.display = "block";
    }
    function m(n, r) {
      const o = performance.now().toString(36);
      const a = t.createElement("embed");
      a.src = "/player.html?s=" + o;
      a.type = "text/html";
      a.width = "1024";
      a.height = "768";
      const i = t => {
        if (t.origin === e.origin && t.data === o) {
          const o = t.source;
          if (null != o) {
            o.postMessage({
              id: n,
              buf: r
            }, {
              targetOrigin: origin,
              transfer: Array.isArray(r) ? [] : [r]
            });
          }
          e.removeEventListener("message", i);
        }
      };
      e.addEventListener("message", i, {
        passive: true
      });
      return a;
    }
    function g(e) {
      const {
        name: n,
        prev: r,
        date: a
      } = e;
      const i = t.createElement("a");
      i.href = a > 0 ? "/" + a.toString(36) : "#";
      i.title = "Play " + n;
      i.target = "_self";
      i.className = "game";
      i.onclick = t => {
        if (!t.ctrlKey) {
          t.preventDefault();
          t.stopPropagation();
          Q(e).catch(e => {
            L(e);
            o("Failed to launch game. Message: " + e);
          });
        }
      };
      i.style.backgroundImage = null != r ? 'url("' + r + '"), url("/res/preview.svg")' : 'url("/d/' + encodeURIComponent(n.replace(/\//g, "")) + '.jpg"), url("/res/preview.svg")';
      {
        const e = t.createElement("div");
        e.textContent = n;
        i.appendChild(e);
      }
      if (e.path.startsWith("https://")) {
        const e = t.createElement("img");
        e.src = "/res/cloud.svg";
        e.alt = "Cloud";
        e.title = "Embedded from third-party servers";
        e.width = 24;
        e.height = 24;
        e.loading = "lazy";
        e.decoding = "async";
        e.draggable = false;
        i.appendChild(e);
      }
      switch (e.type) {
        case "html5":
          {
            const e = t.createElement("span");
            e.textContent = "HTML5";
            e.style.background = "#c04000";
            i.appendChild(e);
          }
          break;
        case "flash":
          {
            const e = t.createElement("span");
            e.textContent = "Flash";
            e.style.background = "#008000";
            i.appendChild(e);
          }
          break;
        case "dos":
          {
            const e = t.createElement("span");
            e.textContent = "Dos";
            e.style.background = "#0000ff";
            i.appendChild(e);
          }
          break;
        default:
          i.style.backgroundImage = 'url("/res/preview.svg")';
      }
      return i;
    }
    function b(e) {
      if (e.startsWith("https://")) {
        const r = t.createElement("iframe");
        r.setAttribute("name", "Frame");
        r.setAttribute("width", "1024");
        r.setAttribute("height", "768");
        r.setAttribute("loading", "lazy");
        r.setAttribute("sandbox", "allow-forms allow-popups allow-scripts allow-same-origin allow-pointer-lock");
        r.setAttribute("scrolling", "no");
        r.setAttribute("frameborder", "0");
        r.setAttribute("credentialless", "true");
        r.setAttribute("referrerpolicy", "no-referrer");
        r.setAttribute("allowfullscreen", "true");
        r.setAttribute("allowpaymentrequest", "true");
        {
          n = e;
          const t = "data:application/xhtml+xml;base64," + na.Base64.encode(na.UTF_8.encode(`<?xml version="1.0" encoding="utf-8" ?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" lang="en">\n\t<head>\n\t\t<meta charset="utf-8" />\n\t\t<meta name="referrer" content="no-referrer" />\n\t\t<meta name="viewport" content="width=device-width,initial-scale=1" />\n\t\t<base href="${origin}" target="_blank" />\n\t\t<link rel="icon" type="image/x-icon" href="res/google.ico" />\n\t\t<link rel="stylesheet" type="text/css" href="data:text/css;base64,Ym9keSxlbWJlZCxpZnJhbWV7cG9zaXRpb246YWJzb2x1dGU7ZGlzcGxheTpibG9jazt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowcHg7cGFkZGluZzowcHg7Ym9yZGVyOm5vbmU7b3ZlcmZsb3c6aGlkZGVuO30K" />\n\t\t<title>Google</title>\n\t</head>\n\t<body>\n\t\t<embed type="text/plain" width="1024" height="768" src="${n.replace(/[&<"']/g, e => {
            switch (e) {
              case "&":
                return "&amp;";
              case "<":
                return "&lt;";
              case ">":
                return "&gt;";
              case '"':
                return "&quot;";
              default:
                return "";
            }
          })}" />\n\t</body>\n</html>`));
          r.addEventListener("load", () => {
            const e = r.contentWindow;
            if (null != e) {
              e.stop();
              e.focus();
              e.location.replace(t);
            } else {
              r.setAttribute("src", t);
            }
          }, {
            once: true,
            passive: true
          });
          H.set(r, e);
        }
        return r;
      }
      {
        const n = t.createElement("embed");
        n.setAttribute("type", "text/plain");
        n.setAttribute("width", "1024");
        n.setAttribute("height", "768");
        n.setAttribute("src", e);
        return n;
      }
      var n;
    }
    function y() {
      te = null;
      if (!X) {
        t.title = "Flamepass";
      }
      E.replaceState(undefined, "", "/");
    }
    function v(t) {
      const n = e.open(undefined, "_blank", "");
      if (null != n) {
        n.stop();
        n.focus();
        setTimeout(() => {
          n.location.replace(t);
        }, 100);
      } else {
        o("Please allow popups in your browser settings and try again.");
      }
    }
    function w(t) {
      const n = e.open(undefined, "_blank", "");
      if (null == n) {
        return void o("Please allow popups in your browser settings and try again.");
      }
      n.focus();
      const r = n.document;
      r.head.innerHTML = '<meta charset="utf-8" /><meta name="referrer" content="no-referrer"/><meta name="viewport" content="width=device-width,initial-scale=1"/><base href="' + e.origin + '" target="_blank" /><link rel="icon" type="image/x-icon" href="res/google.ico" /><link rel="stylesheet" type="text/css" href="data:text/css;base64,Ym9keSxlbWJlZCxpZnJhbWV7cG9zaXRpb246YWJzb2x1dGU7ZGlzcGxheTpibG9jazt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowcHg7cGFkZGluZzowcHg7Ym9yZGVyOm5vbmU7b3ZlcmZsb3c6aGlkZGVuO30K"/>';
      r.body.appendChild(t);
      r.title = "Google";
    }
    function k() {
      const e = t.createElement("iframe");
      e.setAttribute("id", "anchor");
      e.setAttribute("name", "API Anchor");
      e.setAttribute("width", "1024");
      e.setAttribute("height", "768");
      e.setAttribute("loading", "lazy");
      e.setAttribute("scrolling", "no");
      e.setAttribute("frameborder", "0");
      e.setAttribute("credentialless", "true");
      e.setAttribute("referrerpolicy", "no-referrer");
      e.setAttribute("allowfullscreen", "true");
      e.setAttribute("allowpaymentrequest", "true");
      e.addEventListener("load", () => {
        const t = e.contentWindow;
        if (null != t) {
          t.stop();
          t.focus();
          t.location.replace("https://nettleweb.com/?m=1");
        } else {
          e.setAttribute("src", "https://nettleweb.com/?m=1");
        }
      }, {
        once: true,
        passive: true
      });
      S.appendChild(e);
    }
    if ("complete" !== t.readyState) {
      await new Promise(e => {
        const n = () => {
          if ("complete" === t.readyState) {
            t.removeEventListener("readystatechange", n);
            setTimeout(e, 100, null);
          }
        };
        t.addEventListener("readystatechange", n, {
          passive: true
        });
      });
    }
    t.title = "NettleWeb";
    Ii._(e);
    e.focus();
    e.onerror = (e, t, n, r, o) => {
      const a = "Unhandled error at " + (t || "unknown source") + " " + (n || "X") + ":" + (r || "X") + "\n\n Message: " + o;
      I.textContent = a;
      I.style.display = "block";
    };
    e.onkeydown = e => {
      if (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case "h":
          case "q":
            e.preventDefault();
            e.stopPropagation();
            C.replace("https://www.google.com/webhp?igu=1");
            break;
          case "b":
            e.preventDefault();
            e.stopPropagation();
            if (S.hasAttribute("style")) {
              S.removeAttribute("style");
            } else {
              S.setAttribute("style", "filter: blur(15px);");
            }
        }
      }
    };
    e.onpopstate = e => {
      e.preventDefault();
      e.stopPropagation();
      o("Notice: Please press ctrl+Q to leave this website.");
    };
    e.onappinstalled = e => {
      e.preventDefault();
      e.stopPropagation();
      O.style.display = "none";
    };
    e.onbeforeinstallprompt = e => {
      e.preventDefault();
      e.stopPropagation();
      O.style.display = "block";
      O.onclick = () => {
        e.prompt().catch(e => {
          o("Failed to show install prompt. Message: " + e);
        });
      };
    };
    const C = e.location;
    const E = e.history;
    const A = C.pathname;
    const T = new URLSearchParams(C.search);
    const x = t.head;
    const S = t.body;
    const L = Ii.$;
    const I = n("error");
    const j = n("frame");
    const M = n("frame-view");
    const _ = n("status");
    const O = n("install");
    const P = n("content");
    const D = n("accn-btn");
    const F = n("strm-btn");
    const N = n("nmsg-btn");
    const B = n("side-menu");
    {
      const {
        _a: fe,
        _b: me,
        _c: ge,
        _d: be,
        _e: ye,
        _f: ve,
        _g: we,
        _h: ke,
        _i: Ce,
        _j: Ee,
        _k: Ae,
        _l: Te,
        _m: xe,
        _n: Se,
        _o: Le,
        _v: Ie,
        _w: je,
        _p: Me,
        _q: _e,
        _r: Oe
      } = ki;
      if ((() => {
        L(fe, me);
        const e = new URL(C.href);
        const n = e.hostname;
        const o = e.origin;
        switch (e.protocol) {
          case "http:":
            if ("localhost" !== n) {
              e.protocol = "https:";
              C.replace(e.href);
              return false;
            }
            break;
          case "https:":
            break;
          default:
            return true;
        }
        switch (n) {
          case "whitespider.cf":
          case "whitespider.tk":
          case "whitespider.dev":
          case "whitespider.web.app":
          case "whitespider.pages.dev":
          case "whitespider.firebaseapp.com":
            e.host = "nettleweb.com";
            e.hash = "";
            e.search = "";
            e.pathname = "/";
            C.replace(e.href);
            return false;
        }
        {
          const e = t[Le](ke);
          if (null == e || e[Ee](Ce) !== Te) {
            return true;
          }
        }
        for (const e of t[xe](Se)) {
          switch (e[Ee]("type") || "") {
            case "":
            case "text/javascript":
            case "application/javascript":
              break;
            default:
              e.remove();
              return true;
          }
          const t = e[Ee]("src");
          if (!t || e.textContent) {
            e.remove();
            return true;
          }
          const n = new URL(t.startsWith("//") ? "https:" + t : t, o);
          if (n.origin !== o) {
            if ("https:" === n.protocol) {
              const e = n.host.split(".");
              const t = e.length;
              if ("com" === e[t - 1]) {
                const n = e[t - 2];
                if (n.indexOf("google") >= 0 || n.indexOf("firebase") >= 0) {
                  continue;
                }
              }
            }
            e.remove();
            return true;
          }
        }
        return r('link[rel="canonical"]')[Ee]("href").slice(0, ge) !== ve || null == t[Le](Me) || null == t[Le](_e) || t[Oe] !== fe.slice(2, 11);
      })()) {
        L(ye, Ae);
        const Pe = new DOMParser().parseFromString(Ie, "application/xhtml+xml");
        Pe.title = we;
        const De = Pe.body;
        De.innerHTML = be;
        {
          const Fe = Pe.createElement("button");
          Fe.innerHTML = je;
          Fe.setAttribute("type", "button");
          Fe.addEventListener("click", () => {
            C.replace(ve);
          }, {
            passive: true
          });
          De.appendChild(Fe);
        }
        return void t.documentElement.replaceWith(Pe.documentElement);
      }
      for (const Ne of Object.getOwnPropertyNames(ki)) if (2 === Ne.length) {
        delete ki[Ne];
      }
    }
    if (e !== e.top) {
      if ("null" === C.ancestorOrigins?.item(0)) {
        const Be = t.createElement("div");
        Be.style.padding = "15px";
        Be.textContent = "Click here to continue";
        Be.onclick = () => {
          const e = t.createElement("embed");
          e.type = "text/plain";
          e.width = "1280";
          e.height = "720";
          e.src = "https://nettleweb.com/embed.html";
          w(e);
        };
        S.innerHTML = "";
        return void S.appendChild(Be);
      }
      if ("https://nettleweb.com" !== C.origin) {
        return void C.replace("https://nettleweb.com/embed.html");
      }
    }
    se(f({
      appId: "1:176227430389:web:94270de43b7eb971c03abc",
      apiKey: "AIzaSyCPXTy7dt3fpcLd8kVTBtXy0xuBdeuhbFc",
      projectId: "whitespider",
      authDomain: "whitespider.firebaseapp.com",
      databaseURL: "https://whitespider-default-rtdb.firebaseio.com",
      storageBucket: "whitespider.appspot.com",
      measurementId: "G-F72WBJT57S",
      messagingSenderId: "176227430389"
    }, "NettleWeb"));
    const U = e !== e.top && "https://nettleweb.com" !== e.origin;
    const H = new WeakMap();
    const R = new Map();
    const z = function () {
      try {
        const {
          localStorage: t
        } = e;
        if (null == t) {
          throw Error("Storage interface not available.");
        }
        const r = Date.now().toString(36);
        t.setItem("___whitespider___", r);
        if (t.getItem("___whitespider___") !== r) {
          throw Error("Storage test failed: value mismatch");
        }
        return t;
      } catch (e) {
        return Mi;
      }
    }();
    let W;
    let q;
    let V;
    let G;
    let J;
    let X;
    let K;
    let Z;
    let Y;
    let Q;
    let $;
    let ee;
    let te = null;
    let ne = null;
    let re = null;
    let oe = null;
    let ae = null;
    let ie = null;
    let ce = null;
    let le = null;
    let de = null;
    let ue = null;
    if (e.isSecureContext ?? "https:" === C.protocol) {
      if (z !== Mi) {
        try {
          const Ue = await l("/manifest.json", "no-cache");
          if (null != Ue) {
            const He = JSON.parse(Ue).version;
            if (He !== z.getItem("__mf_version")) {
              S.innerHTML = "Updating contents...";
              for (const Re of await caches.keys()) await caches.delete(Re);
              z.setItem("__mf_version", He);
              return void C.reload();
            }
            n("version").textContent = "v" + He;
          }
          W = z.getItem("__secrets_") || undefined;
        } catch (ze) {}
      } else {
        o("Warning: Cookies are blocked by your browser. Some features might not work properly, and your game data will NOT be saved.");
      }
      try {
        const We = e.navigator.serviceWorker;
        if (null != We) {
          await We.register("/sw.js", {
            type: "classic",
            scope: "/",
            updateViaCache: "none"
          });
          await We.ready;
        }
      } catch (qe) {}
    }
    try {
      const Ve = await e.fetch("/d/index.json", {
        mode: "same-origin",
        cache: "no-cache",
        method: "GET"
      });
      if (!Ve.ok) {
        throw Error("Remote returned error status code: " + Ve.status);
      }
      K = na.NTON.decode(yi(new Uint8Array(await Ve.arrayBuffer()), {
        i: 2
      }, undefined && undefined.out, undefined && undefined.dictionary));
    } catch (Ge) {
      return void o("Failed to initialize local game list. Message: " + Ge);
    }
    try {
      const Je = e.top;
      if (null != Je) {
        J = Je === e ? e : Je.origin === e.origin ? Je : null;
      }
    } catch (Xe) {}
    I.onclick = () => {
      I.innerHTML = "";
      I.style.display = "none";
    };
    n("frame-close").onclick = () => {
      j.innerHTML = "";
      M.style.display = "none";
    };
    n("frame-expand").onclick = e => {
      if (t.fullscreenEnabled && !e.ctrlKey) {
        j.requestFullscreen({
          navigationUI: "hide"
        }).catch(e => {
          o("Failed to enter fullscreen mode. Message: " + e);
        });
      } else {
        const e = j.firstElementChild;
        if (null != e) {
          const t = H.get(e) || "";
          if (t.startsWith("https://")) {
            w(b(t));
          }
        }
        j.innerHTML = "";
        M.style.display = "none";
      }
    };
    n("content-page").outerHTML = ki.pages;
    {
      const Ke = r("link[rel*='icon']");
      const Ze = n("overlay");
      const Qe = n("notice");
      const $e = n("theme");
      const et = n("image");
      const tt = n("font");
      const nt = n("backend-url");
      const rt = n("tab-cloaking");
      const ot = n("stealth-mode");
      const at = {
        path: "/K7e8UQ1JqnTj/",
        secure: true,
        upgrade: true,
        protocols: [],
        transports: ["polling", "websocket"],
        timestampParam: "x",
        timestampRequests: true,
        rejectUnauthorized: true,
        closeOnBeforeunload: true
      };
      let it;
      function st(e) {
        V = new gs(e, at);
        _.innerHTML = "Connecting...";
        _.style.color = "#808000";
        V.on("open", () => {
          _.title = "";
          _.innerHTML = "\u2713Connected";
          _.style.color = "#008000";
        });
        V.on("close", t => {
          _.title = t;
          _.innerHTML = "\u2715Disconnected";
          _.style.color = "#ff0000";
          for (const [, e] of R.values()) e("API socket connection closed");
          setTimeout(() => {
            st(e);
          }, 5e3);
        });
        V.on("message", e => {
          const t = new Uint8Array(e, 0, e.byteLength);
          switch (t[0]) {
            case 1:
              if ("string" != typeof q) {
                q = na.UTF_8.decode(t.subarray(1));
              }
              if (null != ne) {
                ne();
              }
              break;
            case 2:
              if (null != re) {
                re(na.UTF_8.decode(t.subarray(1)));
              }
              break;
            case 3:
              if (t.byteLength > 1) {
                Qe.textContent = na.UTF_8.decode(t.subarray(1));
                Qe.style.display = "block";
              }
              break;
            case 4:
              N.setAttribute("data-unread", "");
              break;
            case 5:
              if (null != ie) {
                const e = JSON.parse(na.UTF_8.decode(t.subarray(1)));
                ie(e[0], e[1]);
              }
              break;
            case 6:
              if (null != ce) {
                const e = JSON.parse(na.UTF_8.decode(t.subarray(1)));
                ce(e[0], e[1], e[2]);
              }
              break;
            case 7:
              if (null != le) {
                const e = JSON.parse(na.UTF_8.decode(t.subarray(1)));
                le(e[0], e[1]);
              }
              break;
            case 8:
              if (null != de) {
                const e = JSON.parse(na.UTF_8.decode(t.subarray(1)));
                de(e[0], e[1]);
              }
              break;
            case 9:
              if (null != ue) {
                const e = JSON.parse(na.UTF_8.decode(t.subarray(1)));
                ue(e[0], e[1], e[2]);
              }
              break;
            case 10:
              if (null != oe) {
                oe(na.UTF_8.decode(t.subarray(1)));
              }
              break;
            case 11:
              if (null != ae) {
                ae(na.UTF_8.decode(t.subarray(1)));
              }
              break;
            case 12:
              {
                const n = new DataView(e, 1, 8).getFloat64(0, true);
                const r = R.get(n);
                if (null != r) {
                  r[0](na.NTON.decode(t.subarray(9)));
                  R.delete(n);
                }
              }
              break;
            case 13:
              {
                const n = new DataView(e, 1, 8).getFloat64(0, true);
                const r = R.get(n);
                if (null != r) {
                  r[1](na.UTF_8.decode(t.subarray(9)));
                  R.delete(n);
                }
              }
              break;
            default:
              L("[WARN] Received invalid message ID: ", t[0]);
          }
        });
        if (null != W) {
          V.send(na.UTF_8.encode("\x01" + W));
        }
      }
      function ct(e) {
        if (null == G) {
          const {
            q: e,
            r: t
          } = ki;
          if (null != e && null != t) {
            G = e + t + Si;
          }
        }
        if (null != V) {
          V.close();
        }
        st(e || G || "https://service.nettleweb.com/");
      }
      function lt(e) {
        if ("mono" === e) {
          S.style.fontFamily = '"Ubuntu Mono", monospace';
        } else {
          S.style.removeProperty("font-family");
        }
      }
      function dt(e) {
        if (e.startsWith("data:image/jpeg;base64,")) {
          S.style.background = 'url("' + e + '")';
        } else {
          S.style.removeProperty("background");
        }
      }
      function ut(e) {
        if (null == it) {
          it = t.createElement("link");
          it.rel = "stylesheet";
          it.type = "text/css";
          it.href = "index.dark.css";
          x.appendChild(it);
        }
        switch (e) {
          case "light":
            it.href = "data:text/css;base64,";
            it.removeAttribute("media");
            break;
          case "dark":
            it.href = "index.dark.css";
            it.removeAttribute("media");
            break;
          default:
            it.href = "index.dark.css";
            it.media = "all and (prefers-color-scheme: dark)";
        }
      }
      function ht(e) {
        switch (e) {
          case "empty":
            X = true;
            t.title = "\u2060";
            Ke.type = "image/x-icon";
            Ke.href = "/res/empty.ico";
            break;
          case "google":
            X = true;
            t.title = "Google";
            Ke.type = "image/x-icon";
            Ke.href = "/res/google.ico";
            break;
          case "classroom":
            X = true;
            t.title = "Home";
            Ke.type = "image/png";
            Ke.href = "/res/classroom.png";
            break;
          default:
            X = false;
            t.title = "Flamepass";
            Ke.type = "image/x-icon";
            Ke.href = "/favicon.ico";
        }
      }
      function pt(e) {
        switch (e) {
          case "blank":
            t.onblur = t.onmouseleave = e => {
              if (!Ze.hasAttribute("data-x")) {
                e.preventDefault();
                e.stopPropagation();
                Ze.setAttribute("data-x", "1");
              }
            };
            t.onmousedown = t.ontouchstart = e => {
              if (Ze.hasAttribute("data-x")) {
                e.preventDefault();
                e.stopPropagation();
                Ze.removeAttribute("data-x");
              }
            };
            Ze.innerHTML = "";
            Ze.removeAttribute("data-x");
            break;
          case "google":
            t.onblur = t.onmouseleave = e => {
              if (!Ze.hasAttribute("data-x")) {
                e.preventDefault();
                e.stopPropagation();
                Ze.setAttribute("data-x", "1");
              }
            };
            t.onmousedown = t.ontouchstart = e => {
              if (Ze.hasAttribute("data-x")) {
                e.preventDefault();
                e.stopPropagation();
                Ze.removeAttribute("data-x");
              }
            };
            Ze.innerHTML = '<iframe width="1024" height="768" allowfullscreen="true" allowpaymentrequest="true" name="Frame" allow="fullscreen payment" loading="lazy" scrolling="no" frameborder="0" credentialless="true" referrerpolicy="no-referrer" src="https://www.google.com/webhp?igu=1"></iframe>';
            Ze.removeAttribute("data-x");
            break;
          default:
            Ze.innerHTML = "";
            Ze.removeAttribute("data-x");
            t.onblur = t.onmouseleave = t.onmousedown = t.ontouchstart = null;
        }
      }
      $e.onchange = () => {
        const e = $e.value;
        ut(e);
        z.setItem("__set_theme", e);
      };
      et.onchange = async () => {
        const e = et.files?.item(0);
        if (null != e) {
          if (e.size > 10485760) {
            return void o("Error: Selected file is too large.");
          }
          const t = await d(e, 1280);
          if (null == t) {
            return void o("Error: Failed to decode image file.");
          }
          const n = "data:image/jpeg;base64," + na.Base64.encode(new Uint8Array(await t.arrayBuffer()));
          dt(n);
          z.setItem("__set_image", n);
        } else {
          dt("");
          z.setItem("__set_image", "");
        }
      };
      tt.onchange = () => {
        const e = tt.value;
        lt(e);
        z.setItem("__set_font", e);
      };
      nt.onblur = () => {
        const e = a(nt.value.trim());
        if (null != e) {
          const t = e.href;
          z.setItem("__backendURL_", t);
          ct(nt.value = t);
        } else {
          z.removeItem("__backendURL_");
          ct(nt.value = "");
        }
      };
      rt.onchange = () => {
        const e = rt.value;
        ht(e);
        z.setItem("__set_tabc", e);
      };
      ot.onchange = () => {
        const e = ot.value;
        pt(e);
        z.setItem("__set_sm", e);
      };
      lt(tt.value = z.getItem("__set_font") || "normal");
      dt(z.getItem("__set_image") || "");
      ut($e.value = z.getItem("__set_theme") || "default");
      ht(rt.value = z.getItem("__set_tabc") || "disabled");
      ct(nt.value = z.getItem("__backendURL_") || "");
      pt(ot.value = z.getItem("__set_sm") || "disabled");
    }
    n("clear-data").onclick = async () => {
      for (const e of await caches.keys()) await caches.delete(e);
      z.clear();
      C.reload();
    };
    n("clear-cache").onclick = async () => {
      for (const e of await caches.keys()) await caches.delete(e);
      C.reload();
    };
    {
      const ft = n("headlines");
      h(47).then(e => {
        if (Array.isArray(e)) {
          if (0 !== e.length) {
            ft.innerHTML = "";
            for (const n of e) {
              const e = t.createElement("div");
              const r = n.urlToImage || null;
              {
                const n = t.createElement("img");
                n.src = null == r ? "/res/preview.svg" : "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(r)));
                n.alt = "Preview";
                n.width = 160;
                n.height = 90;
                n.loading = "lazy";
                n.decoding = "async";
                n.draggable = false;
                e.appendChild(n);
              }
              {
                const r = t.createElement("div");
                {
                  const e = t.createElement("div");
                  e.className = "title";
                  e.textContent = n.title;
                  r.appendChild(e);
                }
                {
                  const e = t.createElement("div");
                  e.className = "desc";
                  e.textContent = n.description || "Description is not available for this article.";
                  r.appendChild(e);
                }
                {
                  const e = t.createElement("div");
                  e.className = "time";
                  e.textContent = "Source: " + (n.source.name || "unknown") + "; Author: " + (n.author || "unknown") + "; Published at " + new Date(n.publishedAt).toLocaleString("POSIX", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                  });
                  r.appendChild(e);
                }
                e.appendChild(r);
              }
              e.onclick = () => {
                v(n.url);
              };
              ft.appendChild(e);
            }
          } else {
            ft.innerHTML = "No articles are available at this moment.";
          }
        } else {
          ft.innerHTML = "Error: Failed to parse server response.";
        }
      }).catch(e => {
        ft.textContent = "Failed to fetch from the API server. Message: " + e;
      });
    }
    {
      const mt = n("game-container");
      const gt = n("comments");
      const bt = n("player");
      const yt = n("share");
      const vt = n("like");
      const wt = n("game-page");
      const kt = n("ecode");
      const Ct = n("edit");
      const Et = n("name");
      const At = n("type");
      const Tt = n("tags");
      const xt = n("date");
      const St = n("user");
      const Lt = n("desc");
      const It = n("code");
      const jt = n("lock");
      const Mt = n("comm");
      const _t = n("post");
      const Ot = n("e-name");
      const Pt = n("e-tags");
      const Dt = n("e-desc");
      const Ft = n("e-subm");
      const Nt = n("editor");
      const Bt = n("s-games");
      const Ut = n("loadmore");
      const Ht = n("controller");
      const Rt = n("gnav-back");
      const zt = n("gnav-forward");
      const Wt = n("gnav-page-no");
      const qt = n("gnav-page-count");
      const Vt = [];
      let Gt = "p";
      let Jt = "all";
      let Xt = "";
      let Kt = 0;
      {
        const en = n("game-search");
        const tn = r("#game-search>input");
        let nn = 0;
        en.onsubmit = e => {
          e.preventDefault();
          e.stopPropagation();
          Xt = tn.value.trim().toLowerCase();
          clearTimeout(nn);
          Yt();
        };
        tn.onblur = () => {
          Xt = tn.value.trim().toLowerCase();
          clearTimeout(nn);
          Yt();
        };
        tn.oninput = () => {
          clearTimeout(nn);
          nn = setTimeout(() => {
            Xt = tn.value.trim().toLowerCase();
            Yt();
          }, 1e3);
        };
      }
      {
        const rn = t.querySelectorAll("#game-category>button");
        for (const on of rn) on.onclick = () => {
          for (const e of rn) e.removeAttribute("data-current");
          Jt = on.getAttribute("data-match") || "all";
          on.setAttribute("data-current", "");
          Yt();
        };
      }
      {
        const an = n("game-sort");
        an.value = Gt = z.getItem("__gamesortorder") || "p";
        an.onchange = () => {
          z.setItem("__gamesortorder", Gt = an.value);
          Yt();
        };
      }
      function Zt() {
        switch (Jt) {
          case "all":
            return Xt.length > 0 ? K.filter(e => e.name.toLowerCase().indexOf(Xt) >= 0 || e.tags.indexOf(Xt) >= 0) : [...K];
          case "html5":
            return K.filter(e => "html5" === e.type && (0 === Xt.length || e.name.toLowerCase().indexOf(Xt) >= 0 || e.tags.indexOf(Xt) >= 0));
          case "flash":
            return K.filter(e => "flash" === e.type && (0 === Xt.length || e.name.toLowerCase().indexOf(Xt) >= 0 || e.tags.indexOf(Xt) >= 0));
          case "dos":
            return K.filter(e => "dos" === e.type && (0 === Xt.length || e.name.toLowerCase().indexOf(Xt) >= 0 || e.tags.indexOf(Xt) >= 0));
          default:
            return K.filter(e => e.tags.split(",").indexOf(Jt) >= 0 && (0 === Xt.length || e.name.toLowerCase().indexOf(Xt) >= 0));
        }
      }
      function Yt() {
        Kt = 0;
        Vt.length = 0;
        const e = Zt();
        if (0 === e.length) {
          Rt.disabled = true;
          zt.disabled = true;
          return void (mt.innerHTML = "No results found :(");
        }
        switch (Gt) {
          case "r":
            if ("Joey" === q || "anonymous" === q) {
              e.sort((e, t) => e.desc.length - t.desc.length);
            } else {
              i(e);
            }
            break;
          case "d":
            e.sort((e, t) => t.date - e.date);
            break;
          case "p":
            e.sort((e, t) => (t.count || 0) - (e.count || 0));
        }
        for (let t = 0; t < e.length; t += 100) {
          Vt.push(e.slice(t, t + 100));
        }
        Qt();
      }
      function Qt() {
        Wt.min = "1";
        Wt.max = qt.innerHTML = Vt.length + "";
        Wt.value = Kt + 1 + "";
        mt.innerHTML = "";
        Rt.disabled = Kt < 1;
        if (Kt >= Vt.length - 1) {
          zt.disabled = true;
        } else {
          zt.disabled = false;
        }
        for (const e of Vt[Kt]) mt.appendChild(g(e));
      }
      function $t({
        id: e,
        msg: n,
        uid: r,
        vip: a,
        user: i,
        icon: c
      }, l) {
        const d = t.createElement("div");
        d.setAttribute("id", e);
        const u = t.createElement("div");
        u.className = "user";
        u.textContent = i;
        switch (a) {
          case 3:
            u.setAttribute("data-vip", "gold");
            break;
          case 4:
            u.setAttribute("data-vip", "diamond");
        }
        {
          const e = t.createElement("img");
          e.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(c)));
          e.alt = "Avatar";
          e.width = 32;
          e.height = 32;
          e.loading = "lazy";
          e.decoding = "async";
          e.draggable = false;
          if (null != r) {
            e.style.cursor = u.style.cursor = "pointer";
            e.onclick = u.onclick = () => {
              $(r).catch(e => {
                o("Failed to open user profile. Message: " + e);
              });
            };
          }
          d.appendChild(e);
        }
        const p = t.createElement("div");
        p.appendChild(u);
        if (n.length > 0) {
          const a = t.createElement("span");
          a.textContent = n;
          p.appendChild(a);
          if (null != q && r === q) {
            {
              const r = t.createElement("button");
              r.type = "button";
              r.title = "Edit";
              r.className = "edit";
              r.onclick = () => {
                const i = t.createElement("div");
                const s = t.createElement("input");
                s.type = "text";
                s.value = n;
                s.required = true;
                s.minLength = 1;
                s.maxLength = 1e3;
                s.placeholder = "Message";
                s.autocomplete = "off";
                i.appendChild(s);
                const c = t.createElement("button");
                c.type = "button";
                c.title = "Save";
                c.className = "tick";
                i.appendChild(c);
                const d = t.createElement("button");
                d.type = "button";
                d.title = "Cancel";
                d.className = "cross";
                i.appendChild(d);
                c.onclick = () => {
                  const t = s.value.trim();
                  if (t.length < 1) {
                    o("Comments cannot be empty.");
                  } else if (t.length > 1e3) {
                    o("Comments cannot be longer than 1000 characters.");
                  } else {
                    h(61, [W, e, l, t]).then(() => {
                      n = t;
                      i.remove();
                      r.disabled = false;
                    }).catch(e => {
                      o("Failed to update the comment. Message: " + e);
                    });
                  }
                };
                d.onclick = () => {
                  i.remove();
                  r.disabled = false;
                  a.innerHTML = n;
                };
                r.disabled = true;
                a.innerHTML = "";
                a.appendChild(i);
              };
              d.appendChild(r);
            }
            {
              const n = t.createElement("button");
              n.type = "button";
              n.title = "Delete";
              n.className = "delete";
              n.onclick = () => {
                n.disabled = true;
                h(61, [W, e, l, ""]).catch(e => {
                  o("Failed to delete the comment. Message: " + e);
                });
              };
              d.appendChild(n);
            }
          }
        }
        d.appendChild(p);
        return d;
      }
      Q = async ({
        name: e,
        type: n,
        tags: r,
        date: a,
        path: l,
        desc: d
      }) => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        B.checked = false;
        wt.setAttribute("data-current", "");
        te = () => {
          te = null;
          jt.title = "Enable scroll lock";
          jt.style.backgroundImage = 'url("res/lock-open-w.svg")';
          if (!U) {
            if (!X) {
              t.title = "Flamepass";
            }
            E.replaceState(undefined, "", "/");
          }
          ie = null;
          ce = null;
          bt.innerHTML = "";
          P.style.overflow = "";
        };
        Mt.value = "";
        Ot.value = "";
        Pt.value = "";
        Dt.value = "";
        Bt.innerHTML = "";
        St.innerHTML = "";
        vt.innerHTML = "Like";
        yt.innerHTML = "Share";
        gt.innerHTML = "";
        Nt.style.display = "none";
        Ct.style.display = "block";
        Ht.style.display = "block";
        Et.textContent = e;
        At.textContent = n.toUpperCase();
        Tt.textContent = r.replace(/\,/g, ", ") || "None";
        xt.textContent = new Date(a).toLocaleString("POSIX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
        Lt.textContent = d || "No information provided by the uploader.";
        {
          const n = a.toString(36);
          const r = "/" + n;
          const i = "https://nettleweb.com" + r;
          if (!U) {
            if (!X) {
              t.title = e + " - NettleWeb";
            }
            E.replaceState(undefined, "", r);
          }
          It.textContent = n;
          kt.textContent = '<embed type="text/plain" width="1280" height="720" src="' + i + '?hidegui=1" />';
          yt.onclick = () => {
            navigator.clipboard.writeText(i).then(() => {
              yt.innerHTML = "Link copied!";
            }).catch(e => {
              o("Failed to copy link to clipboard. Message: " + e);
            });
          };
        }
        Ct.innerHTML = "Edit Game Info";
        Ct.disabled = false;
        Ct.onclick = () => {
          if (null != W) {
            Ot.value = e;
            Pt.value = r;
            Dt.value = d;
            Nt.style.display = "block";
            Ct.style.display = "none";
          } else {
            D.click();
          }
        };
        Ft.onclick = () => {
          if (null == W) {
            return void o("Invalid session. Please refresh this page and try again.");
          }
          const e = Ot.value.replace(/\s+/g, " ").trim();
          if (0 === e.length) {
            return void o("Game name must not be empty.");
          }
          if (e.length > 256) {
            return void o("Game name must be less than 256 characters in length.");
          }
          const t = Dt.value.replace(/\s+/g, " ").trim();
          const n = Pt.value.trim().toLowerCase().split(",").map(e => e.replace(/\s+/g, " ").trim()).join(",");
          if (n.length > 300) {
            o("Game tags list must be less than 300 characters long in total.");
          } else if (t.length > 5e3) {
            o("Game description text must be less than 5000 characters in length.");
          } else {
            Ft.disabled = true;
            h(23, [W, a, e, n, t]).then(() => {
              Ct.disabled = true;
              Ct.innerHTML = "Requested. Pending review...";
              Nt.style.display = "none";
              Ct.style.display = "block";
            }).catch(e => {
              o("Failed to submit request. Message: " + e);
            }).finally(() => {
              Ft.disabled = false;
            });
          }
        };
        _t.onclick = () => {
          if (null == W) {
            return void D.click();
          }
          const e = Mt.value.trim();
          if (e.length < 1) {
            o("Comments cannot be empty.");
          } else if (e.length > 1e3) {
            o("Comments cannot be longer than 1000 characters.");
          } else {
            _t.disabled = true;
            h(59, [W, a, e]).then(() => {
              Mt.value = "";
            }).catch(e => {
              o("Failed to post comment. Message: " + e);
            }).finally(() => {
              _t.disabled = false;
            });
          }
        };
        for (const e of i(K.filter(e => !e.path.startsWith("https://"))).slice(3, 9)) if (e.date !== a && Bt.childElementCount < 5) {
          Bt.appendChild(g(e));
        }
        if (l.startsWith("!content!")) {
          bt.appendChild(m(n, await u(l.slice(9))));
        } else {
          bt.appendChild(b(l));
        }
        {
          const e = await h(56, a);
          {
            let t = e.likes;
            vt.textContent = t.toString(10);
            vt.onclick = () => {
              vt.disabled = true;
              h(57, a).then(() => {
                vt.textContent = (++t).toString(10);
              }).catch(e => {
                o("Failed to give a like. Message: " + e);
              }).finally(() => {
                vt.disabled = false;
              });
            };
          }
          {
            const n = t.createElement("img");
            n.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(e.icon)));
            n.alt = "Avatar";
            n.width = 40;
            n.height = 40;
            n.loading = "eager";
            n.decoding = "sync";
            n.draggable = false;
            St.appendChild(n);
          }
          {
            const n = t.createElement("div");
            n.className = "user";
            n.textContent = e.id;
            switch (e.vip) {
              case 3:
                n.setAttribute("data-vip", "gold");
                break;
              case 4:
                n.setAttribute("data-vip", "diamond");
            }
            St.appendChild(n);
          }
          St.onclick = () => {
            $(e.uid).catch(e => {
              o("Failed to open user profile. Message: " + e);
            });
          };
        }
        {
          const e = await h(58, [a]);
          if (20 === e.length) {
            let t = e[e.length - 1].id;
            Ut.style.display = "block";
            Ut.onclick = () => {
              Ut.style.display = "none";
              h(58, [a, t]).then(e => {
                if (20 === e.length) {
                  t = e[e.length - 1].id;
                  Ut.style.display = "block";
                }
                for (const t of e) gt.appendChild($t(t, a));
              }).catch(e => {
                o("Failed to fetch comments. Message: " + e);
              });
            };
          }
          for (const t of e) gt.appendChild($t(t, a));
        }
        ie = (e, t) => {
          if (a === e) {
            gt.prepend($t(t, a));
          }
        };
        ce = (e, t, n) => {
          if (a === e) {
            for (const e of gt.children) if (e.getAttribute("id") === t) {
              const r = e.querySelector("div>span");
              if (null != r) {
                r.textContent = n;
              } else {
                o("Failed to update comment: " + t);
              }
              break;
            }
          }
        };
      };
      Rt.onclick = () => {
        Kt--;
        Qt();
        mt.scrollIntoView({
          behavior: "instant",
          inline: "start",
          block: "start"
        });
      };
      zt.onclick = () => {
        Kt++;
        Qt();
        mt.scrollIntoView({
          behavior: "instant",
          inline: "start",
          block: "start"
        });
      };
      Wt.onblur = () => {
        const e = parseInt(Wt.value.trim(), 10) || 0;
        if (Kt + 1 !== e) {
          if (e < 1 || e > Vt.length) {
            Wt.value = "1";
            Kt = 0;
          } else {
            Kt = e - 1;
          }
          Qt();
          mt.scrollIntoView({
            behavior: "instant",
            inline: "start",
            block: "start"
          });
        }
      };
      Wt.onchange = () => {
        Wt.blur();
      };
      jt.onclick = () => {
        if ("Disable scroll lock" === jt.title) {
          jt.style.backgroundImage = 'url("res/lock-open-w.svg")';
          jt.title = "Enable scroll lock";
          P.style.overflow = "";
        } else {
          jt.style.backgroundImage = 'url("res/lock-w.svg")';
          jt.title = "Disable scroll lock";
          P.style.overflow = "hidden";
          bt.scrollIntoView({
            block: "start",
            inline: "start",
            behavior: "instant"
          });
        }
      };
      Mt.onfocus = () => {
        if (null == W) {
          D.click();
        }
      };
      n("hide").onclick = () => {
        Ht.style.display = "none";
      };
      n("e-canc").onclick = () => {
        Nt.style.display = "none";
        Ct.style.display = "block";
      };
      n("newtab").onclick = () => {
        o("This feature has been temporarily disabled.");
      };
      n("fullscreen").onclick = () => {
        if (t.fullscreenEnabled) {
          const e = bt.firstElementChild;
          if (null != e) {
            e.requestFullscreen({
              navigationUI: "hide"
            }).catch(e => {
              o("Failed to enter fullscreen mode. Message: " + e);
            });
          }
        } else {
          o("Fullscreen mode is not supported in the current browsing context.");
        }
      };
      Yt();
    }
    {
      const sn = r("#yt-search>input");
      const cn = r("#yt-search>button");
      const ln = n("p-load-more");
      const dn = n("yt-load-more");
      const un = n("goto-video");
      const hn = n("videos-page");
      const pn = n("yt-results");
      const fn = n("sserver");
      const mn = n("service");
      const gn = n("video");
      const bn = n("s-videos");
      const yn = n("p-videos");
      const vn = n("video-page");
      const wn = n("playlist-page");
      const kn = n("vcode");
      const Cn = n("vname");
      const En = n("vtags");
      const An = n("vdate");
      const Tn = n("vdesc");
      const xn = n("vlike");
      const Sn = n("vview");
      const Ln = n("origin");
      const In = n("source");
      const jn = n("stream");
      const Mn = n("privacy");
      const _n = n("license");
      const On = n("category");
      const Pn = n("uploader");
      const Dn = n("pname");
      const Fn = n("pdesc");
      const Nn = n("porigin");
      const Bn = n("psource");
      const Un = n("streams");
      const Hn = n("puploader");
      let Rn = "0";
      function zn(e) {
        switch (e.protocol) {
          case "http:":
          case "https:":
            break;
          default:
            return null;
        }
        const t = e.pathname;
        if (t.length < 4) {
          return null;
        }
        switch (e.hostname) {
          case "piped.video":
          case "youtube.com":
          case "www.youtube.com":
          case "youtube-nocookie.com":
          case "www.youtube-nocookie.com":
            return "/watch" === t ? e.searchParams.get("v") || null : "/embed/" === t.slice(0, 7) && t.slice(7) || null;
          case "youtu.be":
            return t.slice(1) || null;
          default:
            return null;
        }
      }
      function Wn(e) {
        const n = e.thumbnails[0]?.url || null;
        const r = t.createElement("div");
        const {
          url: a,
          type: i
        } = e;
        {
          const e = t.createElement("img");
          e.src = null == n ? "/res/preview.svg" : "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(n)));
          e.alt = "Preview";
          e.width = 160;
          e.height = 90;
          e.loading = "lazy";
          e.decoding = "async";
          e.draggable = false;
          r.appendChild(e);
        }
        {
          const n = t.createElement("div");
          {
            const r = t.createElement("div");
            r.className = "title";
            r.textContent = e.name;
            n.appendChild(r);
          }
          {
            const r = t.createElement("div");
            r.className = "desc";
            r.textContent = e.description || "";
            n.appendChild(r);
          }
          {
            let r = "";
            switch (i) {
              case "stream":
                {
                  const {
                    uploadDate: t,
                    uploader: n
                  } = e;
                  if (null != t && t.length > 0) {
                    r += t + "; ";
                  }
                  r += "Views: " + e.viewCount + "; Uploader: " + (n.name || "Unknown") + (n.verified ? " \u2713" : "");
                }
                break;
              case "channel":
                r = "Streams: " + e.streams + "; Subscribers: " + e.subscribers + (e.verified ? " \u2713" : "");
                break;
              case "playlist":
                r = "Streams: " + e.streams + "; Type: " + e.playlist;
                break;
              default:
                r = "No information available for this item.";
            }
            if ("0" === Rn) {
              r += "; Source: YouTube";
            }
            const o = t.createElement("div");
            o.className = "time";
            o.textContent = r;
            n.appendChild(o);
          }
          r.appendChild(n);
        }
        r.onclick = () => {
          switch (i) {
            case "stream":
              Gn(a);
              break;
            case "playlist":
              Jn(a);
              break;
            default:
              L(i);
              o("Function not implemented!");
          }
        };
        return r;
      }
      async function qn(e) {
        mn.disabled = true;
        cn.disabled = true;
        sn.disabled = true;
        dn.style.display = "none";
        const t = await h(65, [e, Rn]);
        if (null == t || "object" != typeof t) {
          return void o("Error: API server returned invalid response.");
        }
        const n = t.results;
        if ("" === e) {
          if (0 === n.length) {
            return void (pn.innerHTML = "No suggestions are available at this moment.");
          }
          pn.innerHTML = "";
        }
        for (const e of n) pn.appendChild(Wn(e));
        if (null != (e = t.nextPageToken)) {
          dn.style.display = "block";
          dn.onclick = () => {
            qn(e).then(() => {
              mn.disabled = false;
              cn.disabled = false;
              sn.disabled = false;
            });
          };
        }
      }
      async function Vn(e) {
        mn.disabled = true;
        cn.disabled = true;
        sn.disabled = true;
        dn.style.display = "none";
        const t = await h(40, [sn.value.trim(), e, "relevance", "videos", Rn]);
        if (null == t || "object" != typeof t) {
          return void o("Error: API server returned invalid response.");
        }
        const n = t.results;
        if (0 !== e.length || 0 !== n.length) {
          for (const e of n) pn.appendChild(Wn(e));
          if (null != (e = t.nextPageToken)) {
            dn.style.display = "block";
            dn.onclick = () => {
              Vn(e).then(() => {
                mn.disabled = false;
                cn.disabled = false;
                sn.disabled = false;
              });
            };
          }
        } else {
          pn.innerHTML = "No matching results found :(";
        }
      }
      function Gn(e) {
        h(63, [e, Rn]).then(n => {
          if (null == n || "object" != typeof n) {
            return void o("Error: API server returned invalid response.");
          }
          if (null != te) {
            te();
          }
          for (const e of pe) e.removeAttribute("data-current");
          P.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
          bn.innerHTML = "";
          B.checked = false;
          vn.setAttribute("data-current", "");
          te = () => {
            te = null;
            gn.innerHTML = "";
          };
          const r = kn.textContent = n.id;
          if ("0" !== Rn) {
            fn.value = "nettle";
            fn.disabled = true;
            In.textContent = "Unknown";
          } else {
            fn.disabled = false;
            In.textContent = "YouTube";
          }
          Cn.textContent = n.name;
          En.textContent = n.tags.join(", ").trim() || "None";
          An.textContent = new Date(Date.parse(n.uploadDate)).toLocaleString("POSIX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          });
          Tn.textContent = n.description.replace(/\<br\>/g, "\n").replace(/<[^>]*>/g, "").trim() || "No information provided by the uploader.";
          xn.textContent = n.likeCount;
          Sn.textContent = n.viewCount;
          Ln.textContent = e;
          jn.textContent = n.stream;
          Mn.textContent = n.privacy;
          _n.textContent = n.license || "Unknown";
          On.textContent = n.category || "Unknown";
          {
            const {
              name: e,
              verified: t,
              subscribers: r
            } = n.uploader;
            Pn.textContent = e + " (" + r + " subscribers)" + (t ? " \u2713" : "");
          }
          {
            const e = n.relatedItems;
            if (e.length > 0) {
              for (const t of e) bn.appendChild(Wn(t));
            } else {
              bn.innerHTML = "No suggestions are available for this video.";
            }
          }
          (fn.onchange = () => {
            switch (fn.value) {
              case "none":
                gn.innerHTML = "";
                gn.appendChild(b("https://www.youtube-nocookie.com/embed/" + r));
                break;
              case "piped":
                gn.innerHTML = "";
                gn.appendChild(b("https://cf.piped.video/watch?v=" + r));
                break;
              default:
                if ((e = n.videoStreams[0]?.url || "").length > 4) {
                  const a = t.createElement("video");
                  a.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(e)));
                  a.width = 800;
                  a.height = 600;
                  a.volume = .8;
                  a.autoplay = true;
                  a.controls = true;
                  a.preservesPitch = false;
                  if ((e = n.thumbnails.pop().url || "").length > 4) {
                    a.poster = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(e)));
                  }
                  a.onerror = () => {
                    o("Video stream failed to load. Falling back to official server.");
                    a.replaceWith(b("https://www.youtube-nocookie.com/embed/" + r));
                  };
                  a.oncanplay = () => {
                    a.onerror = null;
                    a.oncanplay = null;
                  };
                  gn.innerHTML = "";
                  gn.appendChild(a);
                } else if ((e = n.audioStreams[0]?.url || "").length > 4) {
                  const n = t.createElement("audio");
                  n.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(e)));
                  n.volume = .8;
                  n.autoplay = true;
                  n.controls = true;
                  n.preservesPitch = false;
                  n.onerror = () => {
                    o("Error: Failed to load the audio stream.");
                  };
                  n.oncanplay = () => {
                    n.onerror = null;
                    n.oncanplay = null;
                  };
                  gn.innerHTML = "";
                  gn.appendChild(n);
                } else {
                  gn.innerHTML = "Failed to retrieve the video stream. Try switching to a different stream proxy server below.";
                }
            }
          })();
        }).catch(t => {
          o("Failed to fetch video stream information. Message: " + t);
          p("https://www.youtube-nocookie.com/embed/" + zn(new URL(e)));
        });
      }
      function Jn(e) {
        h(66, [e, "", Rn]).then(t => {
          if (null != t && "object" == typeof t) {
            if (null != te) {
              te();
            }
            for (const e of pe) e.removeAttribute("data-current");
            P.scrollTo({
              top: 0,
              left: 0,
              behavior: "instant"
            });
            yn.innerHTML = "";
            B.checked = false;
            ln.style.display = "none";
            wn.setAttribute("data-current", "");
            Dn.textContent = t.name;
            Fn.textContent = t.description.replace(/\<br\>/g, "\n").replace(/<[^>]*>/g, "").trim() || "No information provided by the uploader.";
            Nn.textContent = e;
            Bn.textContent = "0" === Rn ? "YouTube" : "Unknown";
            Un.textContent = t.streams;
            Hn.textContent = t.uploader.name;
            {
              const n = t.results;
              if (n.length > 0) {
                for (const e of n) yn.appendChild(Wn(e));
                let r = t.nextPageToken;
                if (null != r) {
                  ln.style.display = "block";
                  ln.onclick = () => {
                    ln.style.display = "none";
                    h(66, [e, r, Rn]).then(e => {
                      if (null != e && "object" == typeof e) {
                        for (const t of e.results) yn.appendChild(Wn(t));
                        if (null != (r = e.nextPageToken)) {
                          ln.style.display = "block";
                        }
                      } else {
                        o("Error: API server returned invalid response.");
                      }
                    });
                  };
                }
              } else {
                bn.innerHTML = "No streams are found within this playlist.";
              }
            }
          } else {
            o("Error: API server returned invalid response.");
          }
        }).catch(e => {
          o("Failed to fetch playlist information. Message: " + e);
        });
      }
      mn.value = z.getItem("__yt_service") || "0";
      mn.onchange = () => {
        o(null);
        pn.innerHTML = "";
        Rn = mn.value;
        z.setItem("__yt_service", mn.value);
        if (sn.value.length > 0) {
          Vn("").then(() => {
            mn.disabled = false;
            cn.disabled = false;
            sn.disabled = false;
          });
        } else {
          qn("").then(() => {
            mn.disabled = false;
            cn.disabled = false;
            sn.disabled = false;
          });
        }
      };
      n("yt-search").onsubmit = e => {
        e.preventDefault();
        e.stopPropagation();
        o(null);
        pn.innerHTML = "";
        Rn = mn.value;
        const t = a(sn.value);
        if (null != t) {
          const e = zn(t);
          if (null != e) {
            Gn("https://www.youtube.com/watch?v=" + e);
          } else {
            o("Error: Failed to parse video ID from the provided URL.");
          }
        } else {
          Vn("").then(() => {
            mn.disabled = false;
            cn.disabled = false;
            sn.disabled = false;
          });
        }
      };
      F.onclick = un.onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        B.checked = false;
        F.setAttribute("data-current", "");
        hn.setAttribute("data-current", "");
        if (!U) {
          if (!X) {
            t.title = "Flamepass Videos";
          }
          te = y;
          E.replaceState(undefined, "", "/videos");
        }
        if (0 === pn.childElementCount) {
          F.disabled = true;
          un.disabled = true;
          Rn = mn.value;
          qn("").then(() => {
            mn.disabled = F.disabled = un.disabled = cn.disabled = sn.disabled = false;
          });
        }
      };
    }
    {
      const Xn = n("addr");
      const Kn = n("ub-mode");
      function Zn(t) {
        switch (Kn.value) {
          case "raw-embed":
            p(t);
            break;
          case "prq-embed":
            !function (t) {
              const n = (J || e).PaymentRequest;
              if ("function" == typeof n) {
                new n([{
                  data: [t],
                  supportedMethods: "https://nettleweb.com/res/pay.json"
                }], {
                  id: "nettleweb_premium",
                  total: {
                    label: "Premium",
                    amount: {
                      value: "200",
                      currency: "USD"
                    },
                    pending: true
                  },
                  modifiers: [],
                  displayItems: []
                }).show();
              } else {
                o("Error: Your browser does not support this feature.");
              }
            }(t);
            break;
          case "puppeteer":
            h(41, [t, 20]).then(e => {
              p(e);
            }).catch(e => {
              o("Failed to create new session. Message: " + e);
            });
            break;
          default:
            h(41, [t, 10]).then(e => {
              p(e);
            }).catch(e => {
              o("Failed to create new session. Message: " + e);
            });
        }
      }
      function Yn(e, t) {
        const n = a(e = e.replace(/\s+/g, " ").trim());
        if (null != n) {
          return n.href;
        }
        if (e.includes(" ")) {
          return t + encodeURIComponent(e);
        }
        const r = e.indexOf("/");
        if (0 === r) {
          return t + encodeURIComponent(e);
        }
        if (r > 0) {
          if (Qn(e.substring(0, r))) {
            return "https://" + e;
          }
        } else if (Qn(e) && e.includes(".")) {
          return "https://" + e;
        }
        return t + encodeURIComponent(e);
      }
      function Qn(e) {
        e = e.toLowerCase();
        for (let t = 0; t < e.length; t++) {
          const n = e.charCodeAt(t);
          if ((n < 48 || n > 57) && (n < 97 || n > 122) && 45 !== n && 46 !== n) {
            return false;
          }
        }
        return true;
      }
      Kn.value = z.getItem("__unbl_mode_") || "raw-embed-v2";
      Kn.onchange = () => {
        z.setItem("__unbl_mode_", Kn.value);
      };
      Xn.onkeydown = e => {
        if ("Enter" === e.key) {
          e.preventDefault();
          e.stopPropagation();
          const t = Xn.value.trim();
          if (t.length > 0) {
            Zn(Yn(t, "https://www.google.com/search?igu=1&q="));
          }
        }
      };
      n("ub-google").onclick = () => {
        Zn("https://www.google.com/webhp?igu=1");
      };
      n("ub-discord").onclick = () => {
        Zn("https://discord.com/");
      };
      n("ub-facebook").onclick = () => {
        Zn("https://www.facebook.com/");
      };
      n("ub-instagram").onclick = () => {
        Zn("https://www.instagram.com/");
      };
    }
    {
      const $n = n("emulator");
      const er = n("core");
      const tr = n("bios");
      const nr = n("game-rom");
      $n.onchange = () => {
        switch ($n.value) {
          case "ps2":
            er.value = "ps2";
            er.disabled = true;
            tr.disabled = true;
            nr.accept = ".bin, .iso, application/octet-stream";
            break;
          case "swf":
            er.value = "swf";
            er.disabled = true;
            tr.disabled = true;
            nr.accept = ".swf";
            break;
          case "dos":
            er.value = "dos";
            er.disabled = true;
            tr.disabled = true;
            nr.accept = ".jsdos, .zip";
            break;
          default:
            er.value = "nes";
            er.disabled = false;
            tr.disabled = false;
            nr.removeAttribute("accept");
        }
      };
      n("startemu").onclick = () => {
        const e = nr.files?.item(0);
        if (null == e) {
          return void o("Please choose a valid game ROM file.");
        }
        const t = $n.value;
        if ("emu" === t) {
          const n = tr.files?.item(0);
          j.appendChild(m(t, [URL.createObjectURL(e), null == n ? "" : n, er.value]));
          return void (M.style.display = "block");
        }
        e.arrayBuffer().then(e => {
          j.appendChild(m(t, e));
          M.style.display = "block";
        }).catch(e => {
          o("Failed to read game file. Message: " + e);
        });
      };
    }
    {
      const rr = n("upload-message");
      const or = n("game-name");
      const ar = n("game-type");
      const ir = n("game-file");
      const sr = n("game-tags");
      const cr = n("game-desc");
      const lr = n("upload-test");
      const dr = n("test-frame");
      const ur = n("upload");
      let hr = false;
      async function pr(e, t, n) {
        if (null == W) {
          throw Error("Invalid user context");
        }
        let r;
        for (let o = 0; o < 10; o++) {
          try {
            return void (await h(64, [W, e, t, n]));
          } catch (e) {
            r = e;
          }
        }
        throw Error("Too many unsuccessful attempts. Message from the last attempt: " + r);
      }
      rr.onclick = () => {
        rr.innerHTML = "";
        rr.style.display = "none";
      };
      ir.onchange = () => {
        hr = false;
        dr.innerHTML = "";
        lr.style.display = "none";
      };
      ar.onchange = () => {
        switch (ar.value) {
          case "html5":
            ir.accept = ".zip";
            break;
          case "flash":
            ir.accept = ".swf";
            break;
          case "dos":
            ir.accept = ".jsdos";
            break;
          default:
            ir.removeAttribute("accept");
        }
      };
      ur.onclick = () => {
        if (null == W) {
          return void o("Invalid session. Please refresh this page and try again.");
        }
        const e = or.value.replace(/\s+/g, " ").trim();
        if (0 === e.length) {
          return void o("Game name must not be empty.");
        }
        if (e.length > 256) {
          return void o("Game name must be less than 256 characters in length.");
        }
        const t = ir.files?.item(0);
        if (null == t) {
          return void o("Please choose a valid game file.");
        }
        const n = t.size;
        if (0 === n) {
          return void o("Uploading empty game files is not allowed.");
        }
        if (n > 125829120) {
          return void o("Uploading files larger than 120MB is not supported currently.");
        }
        const r = ar.value;
        const a = cr.value.replace(/\s+/g, " ").trim();
        const i = sr.value.trim().toLowerCase().split(",").map(e => e.replace(/\s+/g, " ").trim()).join(",");
        if (i.length > 300) {
          o("Game tags list must be less than 300 characters long in total.");
        } else if (a.length > 5e3) {
          o("Game description text must be less than 5000 characters in length.");
        } else {
          switch (r) {
            case "dos":
            case "flash":
              if (!hr) {
                return void t.arrayBuffer().then(e => {
                  dr.appendChild(m(r, e));
                  lr.style.display = "block";
                  hr = true;
                }).catch(e => {
                  o("Failed to read game file. Message: " + e);
                });
              }
              break;
            case "html5":
              break;
            default:
              return void o("Please select a valid game type.");
          }
          ur.disabled = true;
          rr.innerHTML = "Processing...";
          rr.style.color = "#808080";
          rr.style.display = "block";
          (async () => {
            const o = await h(13, [W, e, r, i, a]);
            for (let e = 0; e < n;) {
              const r = e;
              const a = e += 10485760;
              if (a >= n) {
                const e = t.slice(r, n, "application/octet-stream");
                await pr(o, await e.arrayBuffer(), true);
              } else {
                const e = t.slice(r, a, "application/octet-stream");
                await pr(o, await e.arrayBuffer(), false);
              }
            }
          })().then(() => {
            rr.innerHTML = "\u2713Success!";
            rr.style.color = "#008000";
            rr.style.display = "block";
            hr = false;
            dr.innerHTML = "";
            lr.style.display = "none";
            or.value = "";
            ir.value = "";
            sr.value = "";
            cr.value = "";
            ur.disabled = false;
          }).catch(e => {
            o("Failed to upload the selected game file. Message: " + e);
            rr.innerHTML = "\u2715Error";
            rr.style.color = "#ff0000";
            rr.style.display = "block";
            ur.disabled = false;
          });
        }
      };
    }
    {
      const fr = n("picker");
      const mr = n("msglist");
      const gr = n("history");
      const br = n("channels");
      const yr = n("ufile");
      const vr = n("messages");
      const wr = vr.children;
      const kr = n("chname");
      const Cr = n("chinfo");
      const Er = n("sendmsg");
      const Ar = n("global");
      const Tr = n("friends");
      const xr = n("chatgpt");
      const Sr = n("starter");
      {
        const Lr = n("chat");
        const Ir = n("sidemenu");
        const jr = n("toggle");
        jr.onclick = () => {
          if ("Close" === jr.title) {
            jr.title = "Menu";
            Lr.style.width = "100%";
            Ir.style.display = "none";
          } else {
            jr.title = "Close";
            Lr.removeAttribute("style");
            Ir.removeAttribute("style");
          }
        };
        if (S.clientWidth < 800) {
          jr.title = "Menu";
          Lr.style.width = "100%";
          Ir.style.display = "none";
        }
      }
      {
        const Mr = n("dm-un");
        const _r = n("dm-btn");
        _r.onclick = async () => {
          const e = Mr.value.trim().toLowerCase();
          if (e.length < 4 || e.length > 20 || !/^[\-a-z0-9]+$/.test(e)) {
            o("Please provide a valid username.");
          } else {
            _r.disabled = true;
            try {
              await Y(await h(1, "@" + e));
            } catch (e) {
              o("Failed to started new chat. Message: " + e);
            }
            Mr.value = "";
            _r.disabled = false;
          }
        };
      }
      {
        const Or = n("chat-btn");
        const Pr = n("goto-chat");
        const Dr = n("community-page");
        const Fr = br.children;
        const Nr = mr.children;
        const Br = n("grid");
        const Ur = n("group-page");
        const Hr = n("gredit");
        const Rr = n("grname");
        const zr = n("grcode");
        const Wr = n("grlink");
        const qr = n("grusers");
        let Vr;
        let Gr;
        let Jr;
        let Xr;
        let Kr;
        let Zr = false;
        let Yr = false;
        function Qr({
          id: e,
          uid: n,
          vip: r,
          icon: a
        }) {
          const i = t.createElement("div");
          const c = t.createElement("img");
          c.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(a)));
          c.alt = "Avatar";
          c.width = 48;
          c.height = 48;
          c.loading = "lazy";
          c.decoding = "async";
          c.draggable = false;
          i.appendChild(c);
          {
            const a = t.createElement("div");
            a.className = "user";
            a.textContent = e;
            switch (r) {
              case 3:
                a.setAttribute("data-vip", "gold");
                break;
              case 4:
                a.setAttribute("data-vip", "diamond");
            }
            c.onclick = a.onclick = () => {
              $(n).catch(e => {
                o("Failed to open user profile. Message: " + e);
              });
            };
            i.appendChild(a);
          }
          if (null != Xr && Yr) {
            const e = t.createElement("button");
            e.type = "button";
            e.title = "Kick user";
            e.className = "cross";
            e.onclick = () => {
              h(75, [W, Xr, n]).then(() => {
                i.remove();
              }).catch(e => {
                o("Failed to kick this user. Message: " + e);
              });
            };
            i.appendChild(e);
          }
          return i;
        }
        function $r({
          id: e,
          msg: n,
          uid: r,
          vip: a,
          user: i,
          icon: c,
          files: l
        }) {
          const d = t.createElement("div");
          d.setAttribute("id", e);
          const u = t.createElement("div");
          u.className = "user";
          u.textContent = i;
          switch (a) {
            case 3:
              u.setAttribute("data-vip", "gold");
              break;
            case 4:
              u.setAttribute("data-vip", "diamond");
          }
          {
            const e = t.createElement("img");
            e.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(c)));
            e.alt = "Avatar";
            e.width = 32;
            e.height = 32;
            e.loading = "lazy";
            e.decoding = "async";
            e.draggable = false;
            if (null != r) {
              e.style.cursor = u.style.cursor = "pointer";
              e.onclick = u.onclick = () => {
                $(r).catch(e => {
                  o("Failed to open user profile. Message: " + e);
                });
              };
            }
            d.appendChild(e);
          }
          const p = t.createElement("div");
          p.appendChild(u);
          if (n.length > 0) {
            const a = t.createElement("span");
            a.textContent = n;
            p.appendChild(a);
            if (null != q && (Yr || r === q)) {
              {
                const r = t.createElement("button");
                r.type = "button";
                r.title = "Edit";
                r.className = "edit";
                r.onclick = () => {
                  const i = t.createElement("div");
                  const s = t.createElement("input");
                  s.type = "text";
                  s.value = n;
                  s.required = true;
                  s.minLength = 1;
                  s.maxLength = 1e3;
                  s.placeholder = "Message";
                  s.autocomplete = "off";
                  i.appendChild(s);
                  const c = t.createElement("button");
                  c.type = "button";
                  c.title = "Save";
                  c.className = "tick";
                  i.appendChild(c);
                  const l = t.createElement("button");
                  l.type = "button";
                  l.title = "Cancel";
                  l.className = "cross";
                  i.appendChild(l);
                  c.onclick = () => {
                    const t = s.value.trim();
                    if (t.length < 1) {
                      o("Messages cannot be empty.");
                    } else if (t.length > 1e3) {
                      o("Messages cannot be longer than 1000 characters.");
                    } else if (null != W && null != Xr) {
                      h(62, [W, e, Xr, t]).then(() => {
                        n = t;
                        i.remove();
                        r.disabled = false;
                      }).catch(e => {
                        o("Failed to update message. Reason: " + e);
                      });
                    } else {
                      o("Invalid context. Please refresh this page.");
                    }
                  };
                  l.onclick = () => {
                    i.remove();
                    r.disabled = false;
                    a.innerHTML = n;
                  };
                  r.disabled = true;
                  a.innerHTML = "";
                  a.appendChild(i);
                };
                d.appendChild(r);
              }
              {
                const n = t.createElement("button");
                n.type = "button";
                n.title = "Delete";
                n.className = "delete";
                n.onclick = () => {
                  if (null != W && null != Xr) {
                    n.disabled = true;
                    h(62, [W, e, Xr, ""]).catch(e => {
                      o("Failed to delete message. Reason: " + e);
                    });
                  } else {
                    o("Invalid context. Please refresh this page.");
                  }
                };
                d.appendChild(n);
              }
            }
          }
          for (const {
            name: e,
            type: n,
            url: r
          } of l) {
            const o = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(r)));
            {
              const n = t.createElement("a");
              n.rel = "noopener nofollow";
              n.href = o;
              n.target = "_blank";
              n.download = "";
              n.textContent = e || "file";
              p.appendChild(n);
            }
            switch (n.split("/", 2)[0]) {
              case "image":
                {
                  const e = t.createElement("img");
                  e.src = o;
                  e.alt = "Attachment";
                  e.width = 500;
                  e.height = 500;
                  e.loading = "lazy";
                  e.decoding = "async";
                  e.draggable = false;
                  p.appendChild(e);
                }
                break;
              case "audio":
                {
                  const e = t.createElement("audio");
                  e.src = o;
                  e.volume = .8;
                  e.preload = "metadata";
                  e.controls = true;
                  p.appendChild(e);
                }
                break;
              case "video":
                {
                  const e = t.createElement("video");
                  e.src = o;
                  e.muted = true;
                  e.width = 500;
                  e.height = 500;
                  e.volume = .8;
                  e.autoplay = true;
                  e.controls = true;
                  p.appendChild(e);
                }
            }
          }
          d.appendChild(p);
          return d;
        }
        function eo(e, n, r, a) {
          const i = t.createElement("div");
          i.setAttribute("id", e);
          {
            const e = t.createElement("img");
            e.src = "/res/group.svg";
            e.alt = "Group";
            e.width = 32;
            e.height = 32;
            e.loading = "lazy";
            e.decoding = "async";
            e.draggable = false;
            i.appendChild(e);
          }
          {
            const e = t.createElement("div");
            e.textContent = n;
            i.appendChild(e);
          }
          i.onclick = () => {
            if (!Zr) {
              Zr = true;
              vr.innerHTML = "<div>Loading...</div>";
              Yr = null != q && a[0] === q;
              h(28, [W, Xr = e]).then(t => {
                Kr = t[t.length - 1]?.id;
                vr.innerHTML = "";
                for (const e of t) vr.prepend($r(e));
                vr.scrollTo({
                  behavior: "instant",
                  left: 0,
                  top: vr.scrollHeight
                });
                for (const e of Nr) e.removeAttribute("data-current");
                Cr.setAttribute("data-op", "grinfo");
                Cr.title = "View channel info";
                Cr.onclick = () => {
                  if (null != te) {
                    te();
                  }
                  for (const e of pe) e.removeAttribute("data-current");
                  Ur.setAttribute("data-current", "");
                  B.checked = false;
                  P.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "instant"
                  });
                  Br.textContent = e;
                  Rr.textContent = n;
                  zr.textContent = r;
                  Wr.textContent = "https://nettleweb.com/join/" + r;
                  Hr.style.display = Yr ? "block" : "none";
                  h(72, [W, e, 0]).then(t => {
                    qr.innerHTML = "";
                    if (t.length > 0) {
                      let n = 0;
                      for (const e of t) qr.appendChild(Qr(e));
                      qr.onscrollend = () => {
                        if (qr.scrollTop >= qr.scrollHeight - qr.clientHeight && n >= 0) {
                          h(72, [W, e, n += 10]).then(e => {
                            if (e.length < 10) {
                              n = -1;
                            }
                            for (const t of e) qr.appendChild(Qr(t));
                          });
                        }
                      };
                    }
                  }).catch(e => {
                    o("Failed to fetch the list. Message: " + e);
                  });
                };
                i.setAttribute("data-current", "");
                Sr.style.display = "none";
                kr.textContent = n;
                Zr = false;
              }).catch(e => {
                o("Failed to initialize channel. Message: " + e);
                Zr = false;
              });
            }
          };
          return i;
        }
        function to(e, n, r, a, i) {
          const c = t.createElement("div");
          c.setAttribute("id", e);
          c.setAttribute("data-user", n);
          {
            const e = t.createElement("img");
            e.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(i)));
            e.alt = "Avatar";
            e.width = 32;
            e.height = 32;
            e.loading = "lazy";
            e.decoding = "async";
            e.draggable = false;
            c.appendChild(e);
          }
          {
            const e = t.createElement("div");
            e.className = "user";
            e.textContent = a;
            switch (r) {
              case 3:
                e.setAttribute("data-vip", "gold");
                break;
              case 4:
                e.setAttribute("data-vip", "diamond");
            }
            c.appendChild(e);
          }
          c.onclick = () => {
            if (!Zr) {
              Zr = true;
              vr.innerHTML = "<div>Loading...</div>";
              h(28, [W, Xr = e]).then(e => {
                Kr = e[e.length - 1]?.id;
                vr.innerHTML = "";
                for (const t of e) vr.prepend($r(t));
                vr.scrollTo({
                  behavior: "instant",
                  left: 0,
                  top: vr.scrollHeight
                });
                for (const e of Nr) e.removeAttribute("data-current");
                Cr.setAttribute("data-op", "profile");
                Cr.title = "View user profile";
                Cr.onclick = () => {
                  $(n).catch(e => {
                    o("Failed to open user profile. Message: " + e);
                  });
                };
                c.setAttribute("data-current", "");
                Sr.style.display = "none";
                kr.textContent = a;
                Zr = false;
              }).catch(e => {
                o("Failed to initialize channel. Message: " + e);
                Zr = false;
              });
            }
          };
          return c;
        }
        function no(e, t) {
          if (Xr === e) {
            const e = vr.scrollTop;
            const n = vr.scrollHeight - vr.clientHeight;
            vr.appendChild($r(t));
            if (e >= n - 100) {
              vr.scrollTo({
                behavior: "instant",
                left: 0,
                top: vr.scrollHeight
              });
            }
          }
        }
        function ro(e, t) {
          if (Xr === e) {
            for (const e of wr) if (e.getAttribute("id") === t) {
              e.remove();
              break;
            }
          }
        }
        function oo(e, t, n) {
          if (Xr === e) {
            for (const e of wr) if (e.getAttribute("id") === t) {
              const r = e.querySelector("div>span");
              if (null != r) {
                r.textContent = n;
              } else {
                o("Failed to update message: " + t);
              }
              break;
            }
          }
        }
        async function io() {
          Ar.disabled = true;
          Tr.disabled = true;
          xr.disabled = true;
          Or.disabled = true;
          Pr.disabled = true;
          yr.disabled = true;
          Er.disabled = true;
          if (0 === Fr.length) {
            try {
              const e = await h(22);
              for (const n of e) if ("#" === n[0]) {
                const e = t.createElement("span");
                e.textContent = n.slice(1);
                br.appendChild(e);
              } else {
                const [e, r, a] = n.split(":", 3);
                const i = t.createElement("div");
                i.setAttribute("id", r);
                i.textContent = e;
                i.onclick = () => {
                  if (!Zr) {
                    Zr = true;
                    Yr = false;
                    vr.innerHTML = "<div>Loading...</div>";
                    h(7, [Xr = r]).then(t => {
                      Kr = t[t.length - 1]?.id;
                      vr.innerHTML = "";
                      for (const e of t) vr.prepend($r(e));
                      vr.scrollTo({
                        behavior: "instant",
                        left: 0,
                        top: vr.scrollHeight
                      });
                      for (const e of Fr) e.removeAttribute("data-current");
                      yr.style.display = "f" === a ? "block" : "none";
                      i.setAttribute("data-current", "");
                      kr.textContent = e;
                      Zr = false;
                    }).catch(e => {
                      o("Failed to initialize channel. Message: " + e);
                      Zr = false;
                    });
                  }
                };
                br.appendChild(i);
              }
            } catch (e) {
              return void o("Failed to load channel list. Message: " + e);
            }
          }
          Xr = undefined;
          vr.innerHTML = "";
          kr.innerHTML = "Server";
          Sr.style.display = "none";
          Cr.setAttribute("data-op", "discord");
          Cr.title = "Open chat in Discord";
          Cr.onclick = () => {
            v("https://discord.gg/djdH3kVd4v");
          };
          le = no;
          de = ro;
          ue = oo;
          {
            const e = br.querySelector("div");
            if (null != e) {
              vr.onscrollend = () => {
                if (!Zr && null != Xr && vr.scrollTop < 100) {
                  Zr = true;
                  h(7, [Xr, Kr]).then(e => {
                    if (e.length > 0) {
                      const t = vr.scrollHeight;
                      Kr = e[e.length - 1].id;
                      for (const t of e) vr.prepend($r(t));
                      vr.scrollTo({
                        behavior: "instant",
                        left: 0,
                        top: vr.scrollHeight - t
                      });
                    }
                  }).catch(e => {
                    o("Failed to fetch messages. Reason: " + e);
                  }).finally(() => {
                    Zr = false;
                  });
                }
              };
              Er.onkeydown = e => {
                if ("Enter" === e.key) {
                  e.preventDefault();
                  e.stopPropagation();
                  if (null == W) {
                    return void D.click();
                  }
                  const t = Er.value.trim();
                  if (t.length < 1) {
                    return void o("Messages cannot be empty.");
                  }
                  if (t.length > 1e3) {
                    return void o("Messages cannot be longer than 1000 characters.");
                  }
                  if (null == Xr) {
                    return void o("Please select a valid channel for posting messages.");
                  }
                  Er.value = "";
                  Er.disabled = true;
                  h(8, [W, Xr, t]).then(() => {
                    Er.disabled = false;
                  }).catch(e => {
                    o("Failed to post text message. Message: " + e);
                    Er.disabled = false;
                  });
                }
              };
              e.click();
            } else {
              br.innerHTML = "No public channels are available at this moment.";
              Er.onkeydown = vr.onscrollend = null;
            }
          }
          Er.onfocus = e => {
            e.preventDefault();
            e.stopPropagation();
            if (null == W) {
              D.click();
            }
          };
          Tr.removeAttribute("data-current");
          xr.removeAttribute("data-current");
          Ar.setAttribute("data-current", "");
          mr.removeAttribute("style");
          gr.removeAttribute("style");
          br.style.display = "block";
          Ar.disabled = false;
          Tr.disabled = false;
          xr.disabled = false;
          Or.disabled = false;
          Pr.disabled = false;
          yr.disabled = false;
          Er.disabled = false;
        }
        async function so() {
          if (null != W && null != q) {
            Ar.disabled = true;
            Tr.disabled = true;
            xr.disabled = true;
            Or.disabled = true;
            Pr.disabled = true;
            yr.disabled = true;
            Er.disabled = true;
            Xr = undefined;
            mr.innerHTML = "";
            vr.innerHTML = "";
            kr.innerHTML = "Messages";
            Sr.style.display = "block";
            Cr.removeAttribute("data-op");
            try {
              for (const {
                id: e,
                name: t,
                mode: n,
                code: r,
                users: o
              } of await h(27, W)) if ("0" === n) {
                const {
                  id: t,
                  uid: n,
                  vip: r,
                  icon: a
                } = await h(1, o[0]);
                mr.appendChild(to(e, n, r, t, a));
              } else {
                mr.appendChild(eo(e, t, r, o));
              }
            } catch (e) {
              return void o("Failed to load friends list. Message: " + e);
            }
            le = no;
            de = ro;
            ue = oo;
            vr.onscrollend = () => {
              if (!Zr && null != Xr && vr.scrollTop < 100) {
                Zr = true;
                h(28, [W, Xr, Kr]).then(e => {
                  if (e.length > 0) {
                    const t = vr.scrollHeight;
                    Kr = e[e.length - 1].id;
                    for (const t of e) vr.prepend($r(t));
                    vr.scrollTo({
                      behavior: "instant",
                      left: 0,
                      top: vr.scrollHeight - t
                    });
                  }
                }).catch(e => {
                  o("Failed to fetch messages. Reason: " + e);
                }).finally(() => {
                  Zr = false;
                });
              }
            };
            Er.onkeydown = e => {
              if ("Enter" === e.key) {
                e.preventDefault();
                e.stopPropagation();
                const t = Er.value.trim();
                if (t.length < 1) {
                  return void o("Messages cannot be empty.");
                }
                if (t.length > 1e3) {
                  return void o("Messages cannot be longer than 1000 characters.");
                }
                if (null == Xr) {
                  return void o("Please select a valid channel before posting messages.");
                }
                Er.value = "";
                Er.disabled = true;
                (async () => {
                  if (Xr.startsWith("tmp$")) {
                    const e = Xr.slice(4);
                    try {
                      const t = to(Xr = await h(69, [W, e]), e, Jr, Gr || "", Vr || "/res/user.svg");
                      t.setAttribute("data-current", "");
                      mr.appendChild(t);
                    } catch (e) {
                      return void o("Failed to create new channel. Message: " + e);
                    }
                    vr.innerHTML = "";
                  }
                  try {
                    await h(8, [W, Xr, t]);
                  } catch (e) {
                    o("Failed to post text message. Reason: " + e);
                  }
                })().then(() => {
                  Er.disabled = false;
                });
              }
            };
            Ar.removeAttribute("data-current");
            xr.removeAttribute("data-current");
            Tr.setAttribute("data-current", "1");
            gr.removeAttribute("style");
            br.removeAttribute("style");
            mr.style.display = "block";
            yr.style.display = "block";
            Ar.disabled = false;
            Tr.disabled = false;
            xr.disabled = false;
            Or.disabled = false;
            Pr.disabled = false;
            yr.disabled = false;
            Er.disabled = false;
          } else {
            D.click();
          }
        }
        {
          const co = n("gr-name");
          const lo = n("gr-code");
          const uo = n("gr-join");
          const ho = n("gr-create");
          co.onblur = () => {
            const e = co.value.trim();
            if (e.length > 0) {
              co.value = e;
            }
          };
          lo.onblur = () => {
            const e = lo.value.trim();
            if (e.length > 0) {
              lo.value = e;
            }
          };
          uo.onclick = () => {
            const e = lo.value.trim();
            if (12 === e.length) {
              uo.disabled = true;
              h(70, [W, e]).then(({
                id: t,
                name: n,
                users: r
              }) => {
                {
                  const o = eo(Xr = t, n, e, r);
                  o.setAttribute("data-current", "");
                  mr.appendChild(o);
                  o.click();
                }
                Sr.style.display = "none";
              }).catch(e => {
                o("Failed to join group chat. Message: " + e);
              }).finally(() => {
                uo.disabled = false;
              });
            } else {
              o("The invite code must have exactly 12 characters.");
            }
          };
          ho.onclick = () => {
            const e = co.value.trim();
            if (e.length < 2) {
              o("Group name must contain at least 2 characters.");
            } else if (e.length > 30) {
              o("Group name cannot be longer than 30 characters.");
            } else if (e.indexOf(",", 0) >= 0 || e.indexOf(";", 0) >= 0) {
              o("Group names are not allowed to include commas and semicolons.");
            } else {
              ho.disabled = true;
              h(68, [W, e]).then(({
                id: e,
                name: t,
                code: n,
                users: r
              }) => {
                {
                  const o = eo(Xr = e, t, n, r);
                  o.setAttribute("data-current", "");
                  mr.appendChild(o);
                  o.click();
                }
                Sr.style.display = "none";
              }).catch(e => {
                o("Failed to create new group. Message: " + e);
              }).finally(() => {
                ho.disabled = false;
              });
            }
          };
        }
        {
          const po = t.createElement("input");
          po.type = "file";
          po.multiple = true;
          po.onchange = async () => {
            if (null == Xr) {
              return void o("Please select a valid channel before uploading files.");
            }
            const e = po.files;
            if (null != e && e.length > 0) {
              if (e.length > 10) {
                return void o("Uploading more than 10 files at once is not supported.");
              }
              yr.disabled = true;
              Er.disabled = true;
              try {
                const t = [];
                let n = 0;
                for (const r of e) {
                  const e = r.size;
                  if (e < 1) {
                    throw Error("Empty files are not allowed.");
                  }
                  if (e > 1e7) {
                    throw Error("Files larger than 10MB are not supported.");
                  }
                  if ((n += e) > 12e6) {
                    throw Error("The total size of a single upload cannot exceed 12MB.");
                  }
                  t.push({
                    name: r.name,
                    attachment: await r.arrayBuffer()
                  });
                }
                await h(12, [W, Xr, t]);
              } catch (e) {
                o("Failed to upload file. Message: " + e);
              }
              po.value = "";
              yr.disabled = false;
              Er.disabled = false;
            }
          };
          yr.onclick = () => {
            po.click();
          };
        }
        n("grleave").onclick = () => {
          if (null != Xr && "m" === Xr[0]) {
            h(71, [W, Xr]).then(() => {
              if (null != te) {
                te();
              }
              for (const e of pe) e.removeAttribute("data-current");
              B.checked = false;
              Dr.setAttribute("data-current", "");
              Or.setAttribute("data-current", "");
              P.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
              });
              so();
            }).catch(e => {
              o("Failed to leave the group. Message: " + e);
            });
          } else {
            o("The selected channel is not valid.");
          }
        };
        Hr.onclick = () => {
          const e = t.createElement("div");
          const n = t.createElement("input");
          n.type = "text";
          n.value = Rr.innerHTML;
          n.required = true;
          n.minLength = 2;
          n.maxLength = 30;
          n.placeholder = "Group Name";
          n.autocomplete = "off";
          e.appendChild(n);
          const r = t.createElement("button");
          r.type = "button";
          r.title = "Save";
          r.className = "tick";
          e.appendChild(r);
          const a = t.createElement("button");
          a.type = "button";
          a.title = "Cancel";
          a.className = "cross";
          e.appendChild(a);
          n.onblur = () => {
            const e = n.value.trim();
            if (e.length > 0) {
              n.value = e;
            }
          };
          r.onclick = () => {
            if (null == Xr || "m" !== Xr[0] || !Yr) {
              return void o("The selected channel is not valid.");
            }
            const t = n.value.trim();
            if (t.length < 2) {
              o("Group name must contain at least 2 characters.");
            } else if (t.length > 30) {
              o("Group name cannot be longer than 30 characters.");
            } else if (t.indexOf(",", 0) >= 0 || t.indexOf(";", 0) >= 0) {
              o("Group names are not allowed to include commas and semicolons.");
            } else {
              h(74, [W, Xr, t]).then(() => {
                e.replaceWith(Hr);
                Rr.textContent = t;
              }).catch(e => {
                o("Failed to update group name. Message: " + e);
              });
            }
          };
          a.onclick = () => {
            e.replaceWith(Hr);
          };
          Hr.replaceWith(e);
          n.select();
        };
        Or.onclick = Pr.onclick = () => {
          if (null != te) {
            te();
          }
          for (const e of pe) e.removeAttribute("data-current");
          B.checked = false;
          Dr.setAttribute("data-current", "");
          Or.setAttribute("data-current", "");
          P.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
          if (null == Xr) {
            io();
          }
        };
        Tr.onclick = () => {
          so();
        };
        Ar.onclick = () => {
          io();
        };
        Y = async ({
          id: e,
          uid: t,
          vip: n,
          icon: r
        }) => {
          await so();
          Sr.style.display = "none";
          if (null != te) {
            te();
          }
          for (const e of pe) e.removeAttribute("data-current");
          B.checked = false;
          Dr.setAttribute("data-current", "");
          Or.setAttribute("data-current", "");
          P.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
          for (const e of Nr) if (e.getAttribute("data-user") === t) {
            return void e.click();
          }
          Xr = "tmp$" + t;
          Jr = n || undefined;
          Vr = r;
          kr.innerHTML = Gr = e;
          vr.innerHTML = "<div>Send a message to start a new chat with " + e + ".</div>";
          for (const e of Nr) e.removeAttribute("data-current");
        };
        ee = async e => {
          if ("m" === e[0]) {
            await so();
            Sr.style.display = "none";
            for (const t of Nr) if (t.getAttribute("id") === e) {
              t.click();
              break;
            }
          } else {
            await io();
            for (const t of Fr) if (t.getAttribute("id") === e) {
              t.click();
              break;
            }
          }
          if (null != te) {
            te();
          }
          for (const e of pe) e.removeAttribute("data-current");
          B.checked = false;
          Dr.setAttribute("data-current", "");
          Or.setAttribute("data-current", "");
          P.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
          });
        };
      }
      {
        const fo = gr.children;
        let mo = null;
        const go = JSON.parse(z.getItem("__chats") || "[]");
        function bo({
          role: e,
          text: n
        }) {
          const r = t.createElement("div");
          {
            const n = t.createElement("img");
            n.width = 32;
            n.height = 32;
            n.loading = "lazy";
            n.decoding = "async";
            n.draggable = false;
            if ("u" === e) {
              n.src = "res/user.svg";
              n.alt = "User";
            } else {
              n.src = "res/bot.svg";
              n.alt = "Assistant";
            }
            r.appendChild(n);
          }
          {
            const e = t.createElement("div");
            e.textContent = n;
            r.appendChild(e);
          }
          vr.appendChild(r);
          return r;
        }
        function yo(e) {
          const n = e.title;
          if ("string" != typeof n) {
            throw Error("Invalid chat object");
          }
          const r = t.createElement("div");
          r.onclick = () => {
            for (const e of fo) e.removeAttribute("data-current");
            r.setAttribute("data-current", "1");
            vr.innerHTML = "";
            kr.textContent = n;
            for (const t of mo = e.msgs) bo(t);
            vr.scrollTo({
              behavior: "instant",
              left: 0,
              top: vr.scrollHeight
            });
          };
          {
            const e = t.createElement("div");
            e.textContent = n;
            r.appendChild(e);
          }
          {
            const n = t.createElement("button");
            n.type = "button";
            n.title = "Delete";
            n.onclick = t => {
              t.preventDefault();
              t.stopPropagation();
              const n = go.indexOf(e, 0);
              if (n >= 0) {
                mo = null;
                r.remove();
                go.splice(n, 1);
                vr.innerHTML = "";
                z.setItem("__chats", JSON.stringify(go, undefined, 0));
              }
            };
            r.appendChild(n);
          }
          gr.appendChild(r);
        }
        n("newchat").onclick = () => {
          for (const e of fo) e.removeAttribute("data-current");
          mo = null;
          vr.innerHTML = "";
          kr.innerHTML = "New chat";
        };
        xr.onclick = () => {
          for (const e of fo) e.removeAttribute("data-current");
          mo = null;
          vr.innerHTML = "";
          kr.innerHTML = "New chat";
          Sr.style.display = "none";
          Cr.removeAttribute("data-op");
          le = null;
          de = null;
          ue = null;
          if (fo.length < 2) {
            for (const e of go) yo(e);
          }
          Er.onfocus = vr.onscrollend = null;
          Er.onkeydown = e => {
            if ("Enter" === e.key) {
              e.preventDefault();
              e.stopPropagation();
              const t = Er.value.trim();
              if (t.length < 1) {
                return void o("Messages cannot be empty.");
              }
              if (t.length > 8e3) {
                return void o("Messages cannot be longer than 8000 characters.");
              }
              Er.value = "";
              Er.disabled = true;
              if (null == mo) {
                const e = {
                  title: t.slice(0, 100),
                  msgs: mo = []
                };
                yo(e);
                go.push(e);
              }
              const n = {
                role: "u",
                text: t
              };
              bo(n);
              mo.push(n);
              const r = {
                role: "a",
                text: "Processing..."
              };
              const a = bo(r);
              const i = a.lastElementChild;
              oe = e => {
                if (e.length > 0) {
                  i.textContent = r.text = e;
                  i.scrollIntoView({
                    block: "end",
                    inline: "end",
                    behavior: "instant"
                  });
                } else {
                  mo.push(r);
                  Er.disabled = false;
                  oe = ae = null;
                  z.setItem("__chats", JSON.stringify(go, undefined, 0));
                }
              };
              ae = e => {
                mo.pop();
                a.remove();
                Er.disabled = false;
                oe = ae = null;
                o("Failed to process the request. Message: " + e);
              };
              V.send(na.UTF_8.encode("\x02" + JSON.stringify(mo, undefined, 0)), {
                compress: true
              });
            }
          };
          Ar.removeAttribute("data-current");
          Tr.removeAttribute("data-current");
          xr.setAttribute("data-current", "1");
          mr.removeAttribute("style");
          br.removeAttribute("style");
          gr.style.display = "block";
          yr.style.display = "none";
          Ar.disabled = false;
          Tr.disabled = false;
          xr.disabled = false;
          yr.disabled = true;
          Er.disabled = false;
        };
      }
      n("emoji").onclick = () => {
        if ("block" !== fr.style.display) {
          if (null == fr.firstElementChild) {
            const e = new ao({
              locale: "POSIX",
              emojiVersion: 1e3
            });
            e.addEventListener("emoji-click", e => {
              e.preventDefault();
              e.stopPropagation();
              const t = e.detail.unicode;
              if (null != t) {
                Er.setRangeText(t, Er.selectionStart || 0, Er.selectionEnd || 0, "end");
              }
            });
            fr.appendChild(e);
          }
          fr.style.display = "block";
        } else {
          fr.style.display = "none";
        }
      };
    }
    {
      const vo = n("nwidget");
      N.onclick = () => {
        if (null != W) {
          if (vo.hasAttribute("data-current")) {
            vo.removeAttribute("data-current");
            return void N.removeAttribute("data-current");
          }
          vo.innerHTML = "";
          N.disabled = true;
          h(60, W).then(e => {
            if (Array.isArray(e) && e.length > 0) {
              for (const n of e) {
                const e = t.createElement("div");
                {
                  const r = t.createElement("div");
                  switch (n.type) {
                    case 0:
                      r.textContent = n.text;
                      break;
                    case 1:
                      r.innerHTML = "<b>" + n.user + "</b> sent a direct message to you.";
                      e.onclick = () => {
                        h(1, n.fuid).then(e => {
                          Y(e).catch(e => {
                            o("Failed to open chat channel. Message: " + e);
                          });
                        }).catch(e => {
                          o("Failed to load user info. Message: " + e);
                        });
                      };
                      break;
                    case 2:
                      r.innerHTML = "<b>" + n.user + "</b> mentioned you in a chat channel.";
                      e.onclick = () => {
                        ee(n.chId).catch(e => {
                          o("Failed to open chat channel. Message: " + e);
                        });
                      };
                      break;
                    case 3:
                      r.innerHTML = "<b>" + n.user + "</b> mentioned you in a game comment.";
                      e.onclick = () => {
                        const e = n.game;
                        for (const t of K) if (t.date === e) {
                          Q(t).catch(e => {
                            o("Failed to launch game. Message: " + e);
                          });
                          break;
                        }
                      };
                      break;
                    case 4:
                      r.innerHTML = "<b>" + n.user + "</b> requested to be friend with you.";
                      e.onclick = () => {
                        D.click();
                      };
                      break;
                    default:
                      r.innerHTML = "Error: Failed to parse message.";
                  }
                  e.appendChild(r);
                }
                {
                  const r = t.createElement("span");
                  r.textContent = new Date(n.date).toLocaleString("POSIX", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                  });
                  e.appendChild(r);
                }
                vo.appendChild(e);
              }
            } else {
              vo.innerHTML = "<div>You don't have any notifications.</div>";
            }
            N.disabled = false;
            N.removeAttribute("data-unread");
            vo.setAttribute("data-current", "");
            N.setAttribute("data-current", "");
          }).catch(e => {
            o("Failed to fetch notifications. Message: " + e);
          });
        } else {
          D.click();
        }
      };
    }
    {
      const wo = n("id");
      const ko = n("bio");
      const Co = n("af");
      const Eo = n("dm");
      const Ao = n("pf-games");
      const To = n("avatar");
      const xo = n("profile-page");
      $ = async e => {
        const t = await h(1, e);
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        B.checked = false;
        xo.setAttribute("data-current", "1");
        Co.disabled = false;
        Co.innerHTML = "Add Friend";
        To.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(t.icon)));
        ko.textContent = t.bio || "Flamepass User";
        Ao.innerHTML = "";
        Ao.onscrollend = null;
        Ao.removeAttribute("style");
        {
          const e = wo.textContent = t.id;
          if (!U) {
            te = y;
            E.replaceState(undefined, "", "/@" + e);
          }
        }
        switch (t.vip) {
          case 3:
            wo.setAttribute("data-vip", "gold");
            break;
          case 4:
            wo.setAttribute("data-vip", "diamond");
            break;
          default:
            wo.removeAttribute("data-vip");
        }
        Co.onclick = () => {
          if (null != W) {
            h(24, [W, e]).then(() => {
              Co.disabled = true;
              Co.innerHTML = "Requested";
            }).catch(e => {
              o("Failed to send friend request. Message: " + e);
            });
          } else {
            D.click();
          }
        };
        Eo.onclick = () => {
          if (null != W) {
            Y(t).catch(e => {
              o("Failed to open chat channel. Message: " + e);
            });
          } else {
            D.click();
          }
        };
        {
          const t = K.filter(t => t.user === e);
          if (t.length > 0) {
            let e = 25;
            for (const e of t.slice(0, 25)) Ao.appendChild(g(e));
            Ao.onscrollend = () => {
              if (Ao.scrollTop >= Ao.scrollHeight - Ao.clientHeight) {
                const n = e + 25;
                if (n >= t.length) {
                  Ao.onscrollend = null;
                }
                for (const r of t.slice(e, e = n)) Ao.appendChild(g(r));
              }
            };
          } else {
            Ao.style.overflow = "unset";
            Ao.innerHTML = "This user has not uploaded any games yet.";
          }
        }
      };
    }
    const he = n("chat-profile");
    const pe = t.querySelectorAll("#nav-bar>button, #content>div, #nmsg-btn, #accn-btn, #nwidget");
    {
      const So = n("ff");
      const Lo = n("accountinfo-page");
      const Io = n("ac-friends");
      function jo(e, n) {
        const r = n.uid;
        if ("string" != typeof r) {
          throw Error("Internal Error");
        }
        const a = t.createElement("img");
        a.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(n.icon)));
        a.alt = "Avatar";
        a.width = 48;
        a.height = 48;
        a.loading = "lazy";
        a.decoding = "async";
        a.draggable = false;
        e.appendChild(a);
        {
          const i = t.createElement("div");
          i.className = "user";
          i.textContent = n.id;
          switch (n.vip) {
            case 3:
              i.setAttribute("data-vip", "gold");
              break;
            case 4:
              i.setAttribute("data-vip", "diamond");
          }
          a.onclick = i.onclick = () => {
            $(r).catch(e => {
              o("Failed to open user profile. Message: " + e);
            });
          };
          e.appendChild(i);
        }
        switch (n.state) {
          case 1:
            {
              const n = t.createElement("button");
              n.type = "button";
              n.title = "Cancel request";
              n.className = "cross";
              n.onclick = () => {
                h(25, [W, r]).then(() => {
                  e.remove();
                }).catch(e => {
                  o("Failed to cancel friend request. Message: " + e);
                });
              };
              e.appendChild(n);
            }
            {
              const n = t.createElement("span");
              n.innerHTML = "Requested";
              e.appendChild(n);
            }
            break;
          case 2:
            {
              const a = t.createElement("button");
              a.type = "button";
              a.title = "Accept";
              a.className = "tick";
              a.onclick = () => {
                h(24, [W, r]).then(() => {
                  n.state = 0;
                  e.innerHTML = "";
                  jo(e, n);
                }).catch(e => {
                  o("Failed to accept friend request. Message: " + e);
                });
              };
              e.appendChild(a);
            }
            {
              const n = t.createElement("button");
              n.type = "button";
              n.title = "Reject";
              n.className = "cross";
              n.onclick = () => {
                h(25, [W, r]).then(() => {
                  e.remove();
                }).catch(e => {
                  o("Failed to reject friend request. Message: " + e);
                });
              };
              e.appendChild(n);
            }
            {
              const n = t.createElement("span");
              n.innerHTML = "Accept friend request?";
              e.appendChild(n);
            }
            break;
          default:
            {
              const n = t.createElement("button");
              n.type = "button";
              n.title = "Remove friend";
              n.className = "cross";
              n.onclick = () => {
                h(25, [W, r]).then(() => {
                  e.remove();
                }).catch(e => {
                  o("Failed to remove friend. Message: " + e);
                });
              };
              e.appendChild(n);
            }
            {
              const r = t.createElement("button");
              r.type = "button";
              r.title = "Message";
              r.className = "message";
              r.onclick = () => {
                Y(n).catch(e => {
                  o("Failed to open chat channel. Message: " + e);
                });
              };
              e.appendChild(r);
            }
        }
      }
      Z = () => {
        h(26, [W, 0]).then(e => {
          Io.innerHTML = "";
          if (Array.isArray(e) && e.length > 0) {
            let n = 0;
            for (const n of e) {
              const e = t.createElement("div");
              jo(e, n);
              Io.appendChild(e);
            }
            Io.onscrollend = () => {
              if (Io.scrollTop >= Io.scrollHeight - Io.clientHeight && n >= 0) {
                h(26, [W, n += 10]).then(e => {
                  if (e.length < 10) {
                    n = -1;
                  }
                  for (const n of e) {
                    const e = t.createElement("div");
                    jo(e, n);
                    Io.appendChild(e);
                  }
                });
              }
            };
          }
        }).catch(e => {
          o("Failed to fetch the list. Message: " + e);
        });
      };
      n("chat-login").onclick = he.onclick = D.onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        Io.innerHTML = "Loading...";
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        D.setAttribute("data-current", "1");
        Lo.setAttribute("data-current", "1");
        B.checked = false;
        if ("string" == typeof W) {
          Z();
        }
      };
      So.onclick = () => {
        const e = t.createElement("div");
        const n = t.createElement("input");
        n.type = "text";
        n.minLength = 2;
        n.maxLength = 30;
        n.spellcheck = false;
        n.placeholder = "Username";
        n.autocomplete = "off";
        e.appendChild(n);
        const r = t.createElement("button");
        r.type = "button";
        r.title = "Add";
        r.className = "tick";
        e.appendChild(r);
        const a = t.createElement("button");
        a.type = "button";
        a.title = "Cancel";
        a.className = "cross";
        e.appendChild(a);
        n.onblur = () => {
          const e = n.value.trim().toLowerCase();
          if (e.length > 0) {
            n.value = e;
          }
        };
        r.onclick = () => {
          const r = n.value.trim().toLowerCase();
          if (r.length < 4 || r.length > 20 || !/^[\-a-z0-9]+$/.test(r)) {
            o("Please provide a valid username.");
          } else {
            h(1, "@" + r).then(n => {
              h(24, [W, n.uid]).then(() => {
                const r = t.createElement("div");
                n.state = 1;
                jo(r, n);
                Io.appendChild(r);
                e.replaceWith(So);
              }).catch(e => {
                o("Failed to send friend request. Message: " + e);
              });
            }).catch(e => {
              o("Failed to retrieve user information. Message: " + e);
            });
          }
        };
        a.onclick = () => {
          e.replaceWith(So);
        };
        So.replaceWith(e);
      };
    }
    {
      const Mo = n("home-btn");
      const _o = n("game-btn");
      const Oo = n("apps-btn");
      const Po = n("info-btn");
      const Do = n("home-page");
      const Fo = n("games-page");
      const No = n("gamemu-page");
      const Bo = n("desmos-page");
      const Uo = n("webemu-page");
      const Ho = n("console-page");
      const Ro = n("unbl0ck-page");
      const zo = n("services-page");
      const Wo = n("mirrorlink-page");
      const qo = n("uploadgames-page");
      const Vo = n("settings-page");
      n("logo").onclick = Mo.onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        B.checked = false;
        Do.setAttribute("data-current", "");
        Mo.setAttribute("data-current", "");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("goto-games").onclick = _o.onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        B.checked = false;
        _o.setAttribute("data-current", "");
        Fo.setAttribute("data-current", "");
        if (!U) {
          if (!X) {
            t.title = "Flamepass Games";
          }
          te = y;
          E.replaceState(undefined, "", "/games");
        }
      };
      n("goto-apps").onclick = Oo.onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        B.checked = false;
        Oo.setAttribute("data-current", "");
        zo.setAttribute("data-current", "");
        if (!U) {
          if (!X) {
            t.title = "Flamepass Apps";
          }
          te = y;
          E.replaceState(undefined, "", "/apps");
        }
      };
      Po.onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
        B.checked = false;
        Po.setAttribute("data-current", "");
        Wo.setAttribute("data-current", "");
        if (!U) {
          if (!X) {
            t.title = "About NettleWeb";
          }
          te = y;
          E.replaceState(undefined, "", "/about");
        }
      };
      n("u").onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        Ro.setAttribute("data-current", "");
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("e").onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        No.setAttribute("data-current", "");
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("p").onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        Uo.setAttribute("data-current", "");
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("c").onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        Ho.setAttribute("data-current", "");
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("d").onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        Bo.setAttribute("data-current", "");
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("ug").onclick = () => {
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        qo.setAttribute("data-current", "");
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      n("settings").onclick = () => {
        const e = Vo.hasAttribute("data-current");
        if (null != te) {
          te();
        }
        for (const e of pe) e.removeAttribute("data-current");
        if (e) {
          Mo.setAttribute("data-current", "1");
          Do.setAttribute("data-current", "1");
        } else {
          Vo.setAttribute("data-current", "1");
        }
        B.checked = false;
        P.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      };
      E.scrollRestoration = "manual";
      E.replaceState(undefined, "", "/");
      switch (A) {
        case "/":
          break;
        case "/g":
        case "/g/":
        case "/game":
        case "/game/":
        case "/games":
        case "/games/":
          _o.click();
          break;
        case "/v":
        case "/v/":
        case "/video":
        case "/video/":
        case "/videos":
        case "/videos/":
          F.click();
          break;
        case "/about":
        case "/about/":
          Po.click();
          break;
        case "/a":
        case "/a/":
        case "/apps":
        case "/apps/":
          Oo.click();
          break;
        default:
          if ("/@" === A.slice(0, 2)) {
            const Go = A.slice(1);
            if (Go.length <= 50) {
              try {
                await $(Go);
              } catch (Jo) {
                o("Failed to open user profile. Message: " + Jo);
              }
            }
          } else if ("/join/" === A.slice(0, 6)) {
            const Xo = A.slice(6);
            if (12 === Xo.length) {
              try {
                const Ko = await h(73, Xo);
                n("igrcode").textContent = Xo;
                n("igrname").textContent = Ko.name;
                n("gr-users").textContent = Ko.users;
                n("gr-accept").onclick = () => {
                  if (null != W) {
                    h(70, [W, Xo]).then(({
                      id: e
                    }) => {
                      ee(e).catch(e => {
                        o("Failed to open chat channel. Message: " + e);
                      });
                    }).catch(e => {
                      o("Failed to join group chat. Message: " + e);
                    });
                  } else {
                    D.click();
                  }
                };
                for (const Zo of pe) Zo.removeAttribute("data-current");
                n("group-invite-page").setAttribute("data-current", "");
                B.checked = false;
                P.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "instant"
                });
              } catch (Yo) {
                o("Failed to open invite link. Message: " + Yo);
              }
            }
          } else if ("/reset/" === A.slice(0, 7)) {
            const Qo = A.slice(7);
            if (256 === Qo.length) {
              const $o = n("account-reset-page");
              for (const na of pe) na.removeAttribute("data-current");
              $o.setAttribute("data-current", "");
              B.checked = false;
              P.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
              });
              const ea = n("np");
              const ta = n("rp");
              n("reset").onclick = () => {
                const e = ea.value;
                if (e.length < 8 || e.length > 30) {
                  o("The new password must have 8 to 30 characters.");
                } else if (e === ta.value) {
                  h(76, [Qo, e]).then(() => {
                    $o.remove();
                    D.click();
                  }).catch(e => {
                    o("Failed to reset password. Message: " + e);
                  });
                } else {
                  o("The confirm password does not match the new password.");
                }
              };
            }
          } else if (A.length > 4 && A.length < 20) {
            const ra = parseInt(A.slice(1), 36);
            if (Number.isSafeInteger(ra) && ra > 0) {
              for (const aa of K) if (aa.date === ra) {
                if ("1" === T.get("hidegui")) {
                  const {
                    type: ia,
                    path: sa
                  } = aa;
                  S.innerHTML = "";
                  if (sa.startsWith("!content!")) {
                    S.appendChild(m(ia, await u(sa.slice(9))));
                  } else {
                    S.appendChild(b(sa));
                  }
                  return void k();
                }
                try {
                  await Q(aa);
                } catch (ca) {
                  o("Failed to launch game. Message: " + ca);
                }
                break;
              }
            }
          } else {
            o("Error: Page does not exist: " + A);
          }
      }
      n("loading").remove();
      P.style.display = "block";
    }
    if ("1" === T.get("m")) {
      setTimeout(() => {
        P.scrollTo({
          top: P.scrollHeight,
          left: 0,
          behavior: "instant"
        });
      }, 5e3, null);
    }
    if ("https://nettleweb.com" === e.origin) {
      {
        const ua = t.createElement.bind(t);
        Object.defineProperty(t, "createElement", {
          value: (e, t) => {
            const n = ua(e, t);
            if ("iframe" === n.tagName.toLowerCase()) {
              n.setAttribute("credentialless", "true");
            }
            return n;
          },
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      {
        const ha = t.createElementNS.bind(t);
        Object.defineProperty(t, "createElementNS", {
          value: (e, t, n) => {
            const r = ha(e, t, n);
            if ("iframe" === r.tagName.toLowerCase()) {
              r.setAttribute("credentialless", "true");
            }
            return r;
          },
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      const la = await l("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7505521340110301");
      if (null != la && la.length > 0) {
        try {
          Function("arguments", "globalThis", "window", "frames", "self", "document", la).call(e, undefined, e, e, e, e, t);
        } catch (pa) {}
      } else {
        o("You are using an ad blocker. Please disable it to support this website's development.");
      }
      const da = e.adsbygoogle ||= [];
      for (const fa of t.querySelectorAll("ins.adsbygoogle")) {
        fa.setAttribute("data-ad-client", "ca-pub-7505521340110301");
        fa.setAttribute("data-ad-format", "auto");
        fa.setAttribute("data-full-width-responsive", "true");
        try {
          da.push(1);
        } catch (ma) {}
      }
    } else {
      k();
    }
    {
      async function ga() {
        Z();
        D.title = "My Account";
        D.setAttribute("data-ac", "");
        n("ac-prof").style.display = "block";
        n("chat-login").remove();
        n("login-dialog").remove();
        const e = n("ac-bio");
        const r = n("ac-name");
        const a = n("ac-email");
        const i = n("ac-un");
        const c = n("ac-edit");
        const l = n("ac-link");
        const u = n("ac-bio-edit");
        const p = n("ac-name-edit");
        const f = n("ac-email-edit");
        const m = n("cp");
        const b = n("rs");
        const y = n("tf");
        if ("1" === z.getItem("__?2fa")) {
          y.setAttribute("data-enabled", "");
          y.textContent = "Disable Two-Factor";
        }
        const v = n("ch-avatar");
        const w = v.firstElementChild;
        const k = t.createElement("img");
        k.alt = "Avatar";
        k.width = 40;
        k.height = 40;
        k.loading = "eager";
        k.decoding = "sync";
        k.draggable = false;
        he.appendChild(k);
        const E = t.createElement("div");
        E.className = "user";
        he.appendChild(E);
        he.style.display = "block";
        const A = await h(2, W);
        const T = A.id;
        const x = A.uid;
        if ("string" != typeof T || T.length < 4 || "string" != typeof x || x.length < 2) {
          o("Error: Server response parse error.");
        } else {
          e.textContent = A.bio || "Flamepass User";
          r.textContent = A.name || "Not set";
          a.textContent = A.email || "Not set";
          w.src = k.src = "https://" + ki.b + "/" + ki.c + "?OO0O0OO0=" + encodeURIComponent(na.Base64.encode(na.UTF_8.encode(A.icon)));
          i.textContent = T;
          E.textContent = T;
          n("ac-uid").textContent = x;
          if (A.unread) {
            N.setAttribute("data-unread", "");
          }
          switch (A.vip) {
            case 3:
              n("ac-membership").textContent = "Gold \u{1f451}";
              i.setAttribute("data-vip", "gold");
              E.setAttribute("data-vip", "gold");
              break;
            case 4:
              n("ac-membership").textContent = "Diamond \u{1f48e}";
              i.setAttribute("data-vip", "diamond");
              E.setAttribute("data-vip", "diamond");
              break;
            default:
              n("ac-membership").textContent = "None";
          }
          {
            const e = n("ac-games");
            const t = K.filter(e => e.user === x);
            let r = 25;
            for (const n of t.slice(0, 25)) e.appendChild(g(n));
            e.onscrollend = () => {
              if (r < t.length && e.scrollTop >= e.scrollHeight - e.clientHeight) {
                for (const n of t.slice(r, r += 25)) e.appendChild(g(n));
              }
            };
          }
          v.onclick = () => {
            const e = t.createElement("input");
            e.type = "file";
            e.accept = "image/*";
            e.onchange = async () => {
              const t = e.files?.item(0);
              if (null != t) {
                const e = await d(t, 512, 512);
                if (null == e) {
                  return void o("Error: Failed to resize image.");
                }
                try {
                  await h(4, [W, await e.arrayBuffer()]);
                } catch (e) {
                  return void o("Failed to upload the image file. Message: " + e);
                }
                const n = URL.createObjectURL(e);
                w.src = k.src = n;
                await w.decode();
                await k.decode();
                URL.revokeObjectURL(n);
              }
            };
            e.click();
          };
          c.onclick = () => {
            const e = t.createElement("div");
            const n = t.createElement("input");
            n.type = "text";
            n.value = i.innerHTML;
            n.minLength = 4;
            n.maxLength = 20;
            n.spellcheck = false;
            n.placeholder = "Username";
            n.autocomplete = "off";
            e.appendChild(n);
            const r = t.createElement("button");
            r.type = "button";
            r.title = "Save";
            r.className = "tick";
            e.appendChild(r);
            const a = t.createElement("button");
            a.type = "button";
            a.title = "Cancel";
            a.className = "cross";
            e.appendChild(a);
            n.onblur = () => {
              const e = n.value.trim().toLowerCase();
              if (e.length > 0) {
                n.value = e;
              }
            };
            r.onclick = () => {
              const t = n.value.trim().toLowerCase();
              if (t.length < 4 || t.length > 20) {
                o("Username must be between 4 and 20 characters long.");
              } else if (/^[\-a-z0-9]+$/.test(t)) {
                h(3, [W, t]).then(() => {
                  e.replaceWith(i);
                  i.textContent = t;
                  E.textContent = t;
                  c.removeAttribute("style");
                }).catch(e => {
                  o("Failed to change username. Message: " + e);
                });
              } else {
                o("Username must contain only hyphens, 0-9, lowercase a-z");
              }
            };
            a.onclick = () => {
              e.replaceWith(i);
              c.removeAttribute("style");
            };
            c.style.display = "none";
            i.replaceWith(e);
            n.select();
          };
          l.onclick = () => {
            const e = "https://nettleweb.com/@" + T;
            const n = t.createElement("span");
            n.textContent = e;
            l.replaceWith(n);
            navigator.clipboard.writeText(e).catch(e => {
              o("Failed to copy link to clipboard. Message: " + e);
            });
          };
          u.onclick = () => {
            const n = t.createElement("div");
            const r = t.createElement("input");
            r.type = "text";
            r.value = e.innerHTML;
            r.minLength = 1;
            r.maxLength = 500;
            r.spellcheck = false;
            r.placeholder = "Bio";
            r.autocomplete = "off";
            n.appendChild(r);
            const a = t.createElement("button");
            a.type = "button";
            a.title = "Save";
            a.className = "tick";
            n.appendChild(a);
            const i = t.createElement("button");
            i.type = "button";
            i.title = "Cancel";
            i.className = "cross";
            n.appendChild(i);
            r.onblur = () => {
              const e = r.value.trim();
              if (e.length > 0) {
                r.value = e;
              }
            };
            a.onclick = () => {
              const t = r.value.trim();
              if (t.length > 500) {
                o("Bio cannot have more than 500 characters in length.");
              } else {
                h(55, [W, t]).then(() => {
                  n.replaceWith(e);
                  u.removeAttribute("style");
                  e.textContent = t || "Flamepass User";
                }).catch(e => {
                  o("Failed to update bio. Message: " + e);
                });
              }
            };
            i.onclick = () => {
              n.replaceWith(e);
              u.removeAttribute("style");
            };
            u.style.display = "none";
            e.replaceWith(n);
            r.select();
          };
          p.onclick = () => {
            const e = t.createElement("div");
            const n = t.createElement("input");
            n.type = "text";
            n.value = r.innerHTML;
            n.minLength = 2;
            n.maxLength = 30;
            n.spellcheck = false;
            n.placeholder = "Name";
            n.autocomplete = "off";
            e.appendChild(n);
            const a = t.createElement("button");
            a.type = "button";
            a.title = "Save";
            a.className = "tick";
            e.appendChild(a);
            const i = t.createElement("button");
            i.type = "button";
            i.title = "Cancel";
            i.className = "cross";
            e.appendChild(i);
            n.onblur = () => {
              const e = n.value.trim();
              if (e.length > 0) {
                n.value = e;
              }
            };
            a.onclick = () => {
              const t = n.value.trim();
              if (t.length > 30) {
                o("Name cannot have more than 30 characters in length.");
              } else {
                h(20, [W, t]).then(() => {
                  e.replaceWith(r);
                  r.textContent = t;
                  p.removeAttribute("style");
                }).catch(e => {
                  o("Failed to update name. Message: " + e);
                });
              }
            };
            i.onclick = () => {
              e.replaceWith(r);
              p.removeAttribute("style");
            };
            p.style.display = "none";
            r.replaceWith(e);
            n.select();
          };
          f.onclick = () => {
            const e = t.createElement("div");
            const n = t.createElement("input");
            n.type = "email";
            n.value = a.innerHTML;
            n.minLength = 6;
            n.maxLength = 320;
            n.spellcheck = false;
            n.placeholder = "Email";
            n.autocomplete = "off";
            e.appendChild(n);
            const r = t.createElement("button");
            r.type = "button";
            r.title = "Save";
            r.className = "tick";
            e.appendChild(r);
            const i = t.createElement("button");
            i.type = "button";
            i.title = "Cancel";
            i.className = "cross";
            e.appendChild(i);
            n.onblur = () => {
              const e = n.value.trim().toLowerCase();
              if (e.length > 0) {
                n.value = e;
              }
            };
            r.onclick = () => {
              const i = n.value.trim().toLowerCase();
              if (i.length < 6 || i.length > 320 || i.indexOf("@", 1) < 0) {
                o("Please provide a valid email address.");
              } else {
                h(19, [W, i]).then(() => {
                  {
                    const n = t.createElement("div");
                    n.textContent = "Please check your inbox and fill in the 6-digit verification code below to verify your email address.";
                    e.prepend(n);
                  }
                  n.type = "text";
                  n.value = "";
                  n.minLength = 6;
                  n.maxLength = 6;
                  n.placeholder = "6-digit verification code";
                  n.onblur = () => {
                    const e = n.value.trim();
                    if (e.length > 0) {
                      n.value = e;
                    }
                  };
                  r.onclick = () => {
                    const t = n.value.trim();
                    if (6 === t.length && /^\d+$/.test(t)) {
                      h(18, [W, t]).then(() => {
                        e.replaceWith(a);
                        a.textContent = i;
                        f.removeAttribute("style");
                      }).catch(e => {
                        o("Failed to verify your email. Message: " + e);
                      });
                    } else {
                      o("The code provided must have exactly 6 digits.");
                    }
                  };
                }).catch(e => {
                  o("Failed to update your email address. Message: " + e);
                });
              }
            };
            i.onclick = () => {
              e.replaceWith(a);
              f.removeAttribute("style");
            };
            f.style.display = "none";
            a.replaceWith(e);
            n.select();
          };
          m.onclick = () => {
            const e = t.createElement("div");
            {
              const n = t.createElement("div");
              n.setAttribute("style", "position:relative;display:block;width:fit-content;height:fit-content;margin:10px 0px;padding:5px;line-height:18px;");
              n.innerHTML = "Notice: If your account was created with your Google account and does not have a password, set the current password field to 'CHANGEME!'. After changing your password, previously logged-in sessions will still have access to your account. To revoke the access, click the 'logout all sessions' button down below.";
              e.appendChild(n);
            }
            const n = t.createElement("input");
            n.type = "password";
            n.minLength = 8;
            n.maxLength = 30;
            n.spellcheck = false;
            n.placeholder = "Current password";
            n.autocomplete = "off";
            e.appendChild(n);
            const r = t.createElement("input");
            r.type = "password";
            r.minLength = 8;
            r.maxLength = 30;
            r.spellcheck = false;
            r.placeholder = "New password";
            r.autocomplete = "off";
            e.appendChild(r);
            const a = t.createElement("input");
            a.type = "password";
            a.minLength = 8;
            a.maxLength = 30;
            a.spellcheck = false;
            a.placeholder = "Confirm password";
            a.autocomplete = "off";
            e.appendChild(a);
            const i = t.createElement("button");
            i.type = "button";
            i.title = "Change";
            i.className = "tick";
            e.appendChild(i);
            const s = t.createElement("button");
            s.type = "button";
            s.title = "Cancel";
            s.className = "cross";
            e.appendChild(s);
            i.onclick = () => {
              const t = n.value;
              if (t.length < 8 || t.length > 30) {
                return void o("The current password must have 8 to 30 characters.");
              }
              const i = r.value;
              if (i.length < 8 || i.length > 30) {
                o("The new password must have 8 to 30 characters.");
              } else if (t !== i) {
                if (i === a.value) {
                  h(9, [W, t, i]).then(() => {
                    e.replaceWith(m);
                  }).catch(e => {
                    o("Failed to change password. Message: " + e);
                  });
                } else {
                  o("The confirm password does not match the new password.");
                }
              } else {
                o("The new password must be different from the current password.");
              }
            };
            s.onclick = () => {
              e.replaceWith(m);
            };
            m.replaceWith(e);
          };
          b.onclick = () => {
            h(43, W).then(e => {
              if ("string" == typeof e && 2048 === e.length) {
                V.send(na.UTF_8.encode("\x01" + (W = e)));
                z.setItem("__secrets_", e);
                b.disabled = true;
              } else {
                o("Error: Remote returned invalid token.");
              }
            }).catch(e => {
              o("Failed to revoke login tokens. Message: " + e);
            });
          };
          y.onclick = () => {
            const e = t.createElement("div");
            if (y.hasAttribute("data-enabled")) {
              const n = t.createElement("input");
              n.type = "text";
              n.minLength = 6;
              n.maxLength = 6;
              n.spellcheck = false;
              n.placeholder = "6-digit verification code";
              n.autocomplete = "off";
              e.appendChild(n);
              const r = t.createElement("button");
              r.type = "button";
              r.title = "Change";
              r.className = "tick";
              e.appendChild(r);
              r.onclick = () => {
                const t = n.value.trim();
                if (6 === t.length && /^\d+$/.test(t)) {
                  h(46, [W, t]).then(() => {
                    z.setItem("__?2fa", "0");
                    e.replaceWith(y);
                    y.removeAttribute("data-enabled");
                    y.textContent = "Enable Two-Factor";
                  }).catch(e => {
                    o("Failed to enable two-factor authentication. Message: " + e);
                  });
                } else {
                  o("The code provided must have exactly 6 digits.");
                }
              };
            } else {
              {
                const n = t.createElement("div");
                n.setAttribute("style", "position:relative;display:block;width:fit-content;height:fit-content;margin:15px 0px;line-height:18px;white-space:pre-wrap;");
                n.innerHTML = 'In order to enable two-factor authentication (2FA), please follow the steps below:\n1. Install an <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener">authenticator app</a> if you don\'t have one already.\n2. Scan the QR code below or manually input the secret to save your account onto the authenticator.\n3. Input the 6-digit verification code generated below to verify.\n\nAfter enabling 2FA, you will be required to input the generated 6-digit verification code everytime as you login for enhanced account security.\n\nTo avoid being locked out, save the secret or a screenshot of the QR code across multiple devices, so that it could be restored back into the authenticator in case you lost your data.';
                e.appendChild(n);
              }
              const n = na.Base32.encode(crypto.getRandomValues(new Uint8Array(new ArrayBuffer(32), 0, 32)));
              {
                const r = t.createElement("img");
                r.alt = "QR Code";
                r.width = 147;
                r.height = 147;
                r.loading = "eager";
                r.decoding = "sync";
                r.draggable = false;
                r.src = qa("otpauth://totp/NettleWeb:" + T + "?secret=" + n + "&issuer=NettleWeb&algorithm=SHA1").toDataURL({
                  type: "image/png",
                  scale: 3
                });
                e.appendChild(r);
              }
              {
                const r = t.createElement("div");
                r.setAttribute("style", "position:relative;display:block;width:fit-content;height:fit-content;margin:15px 0px;line-height:18px;");
                r.textContent = "Secret: " + n;
                e.appendChild(r);
              }
              const r = t.createElement("input");
              r.type = "text";
              r.minLength = 6;
              r.maxLength = 6;
              r.spellcheck = false;
              r.placeholder = "6-digit verification code";
              r.autocomplete = "off";
              e.appendChild(r);
              const a = t.createElement("button");
              a.type = "button";
              a.title = "Change";
              a.className = "tick";
              e.appendChild(a);
              a.onclick = () => {
                const t = r.value.trim();
                if (6 === t.length && /^\d+$/.test(t)) {
                  h(44, [W, n, t]).then(() => {
                    z.setItem("__?2fa", "1");
                    e.replaceWith(y);
                    y.setAttribute("data-enabled", "");
                    y.textContent = "Disable Two-Factor";
                  }).catch(e => {
                    o("Failed to enable two-factor authentication. Message: " + e);
                  });
                } else {
                  o("The code provided must have exactly 6 digits.");
                }
              };
            }
            const n = t.createElement("button");
            n.type = "button";
            n.title = "Cancel";
            n.className = "cross";
            e.appendChild(n);
            n.onclick = () => {
              e.replaceWith(y);
            };
            y.replaceWith(e);
          };
          n("so").onclick = () => {
            z.removeItem("__secrets_");
            setTimeout(() => C.reload(), 200);
          };
          n("da").onclick = () => {
            o("Error: Operation not permitted.");
          };
          n("account-settings").style.display = "block";
        }
      }
      if (null != W) {
        const xa = await new Promise(e => {
          ne = () => {
            ne = re = null;
            e(null);
          };
          re = t => {
            ne = re = null;
            e(t);
          };
          V.send(na.UTF_8.encode("\x01" + W));
        });
        if (null == xa) {
          return void (await ga());
        }
        o("Failed to validate login token. Please login again. Message: " + xa);
        W = null;
      }
      const ba = n("login-dialog");
      let ya;
      let va;
      let wa;
      function ka() {
        ba.style.display = "none";
        ba.innerHTML = "";
        {
          const e = t.createElement("h3");
          e.textContent = "Login";
          ba.appendChild(e);
        }
        const e = t.createElement("input");
        e.type = "text";
        e.value = va || "";
        e.required = true;
        e.minLength = 4;
        e.maxLength = 320;
        e.spellcheck = false;
        e.placeholder = "Username/Email";
        e.autocomplete = "off";
        ba.appendChild(e);
        const n = t.createElement("input");
        n.type = "password";
        n.value = wa || "";
        n.required = true;
        n.minLength = 8;
        n.maxLength = 30;
        n.spellcheck = false;
        n.placeholder = "Password";
        n.autocomplete = "off";
        ba.appendChild(n);
        const r = t.createElement("button");
        r.type = "button";
        r.className = "pri-button";
        r.textContent = "Login";
        ba.appendChild(r);
        const a = t.createElement("div");
        a.tabIndex = 0;
        a.textContent = "Register";
        ba.appendChild(a);
        const i = t.createElement("div");
        i.tabIndex = 0;
        i.textContent = "Forgot password";
        ba.appendChild(i);
        const s = t.createElement("div");
        s.tabIndex = 0;
        s.textContent = "Sign in with Google";
        ba.appendChild(s);
        e.onblur = () => {
          const t = e.value.trim().toLowerCase();
          if (t.length > 0) {
            va = e.value = t;
          }
        };
        n.onblur = () => {
          const e = n.value;
          if (e.length > 0) {
            wa = e;
          }
        };
        r.onclick = () => {
          const t = va = e.value.trim().toLowerCase();
          if (t.indexOf("@", 1) < 0) {
            if (t.length < 4 || t.length > 20) {
              return void o("Username must be between 4 and 20 characters long.");
            }
            if (!/^[\-a-z0-9]+$/.test(t)) {
              return void o("Username must contain only hyphens, 0-9, lowercase a-z.");
            }
          } else if (t.length < 6 || t.length > 320) {
            return void o("Invalid email address. (Usernames should not contain a '@' symbol)");
          }
          const r = wa = n.value;
          if (r.length < 8 || r.length > 30) {
            o("Password must be between 8 and 30 characters long.");
          } else {
            h(10, [t, r]).then(e => {
              if ("string" == typeof e) {
                Aa(e);
              } else {
                o("Error: Remote returned invalid token data.");
              }
            }).catch(e => {
              o("Failed to retrieve login token. Message: " + e);
            });
          }
        };
        a.onclick = Ca;
        i.onclick = Ea;
        s.onclick = Ta;
        ba.style.display = "block";
      }
      function Ca() {
        ba.style.display = "none";
        ba.innerHTML = "";
        {
          const e = t.createElement("h3");
          e.textContent = "Register";
          ba.appendChild(e);
        }
        const e = t.createElement("input");
        e.type = "text";
        e.value = va || "";
        e.required = true;
        e.minLength = 4;
        e.maxLength = 20;
        e.spellcheck = false;
        e.placeholder = "Username";
        e.autocomplete = "off";
        ba.appendChild(e);
        const n = t.createElement("input");
        n.type = "email";
        n.value = ya || "";
        n.required = true;
        n.minLength = 6;
        n.maxLength = 320;
        n.spellcheck = false;
        n.placeholder = "Email";
        n.autocomplete = "off";
        ba.appendChild(n);
        const r = t.createElement("input");
        r.type = "password";
        r.value = wa || "";
        r.required = true;
        r.minLength = 8;
        r.maxLength = 30;
        r.spellcheck = false;
        r.placeholder = "Password";
        r.autocomplete = "off";
        ba.appendChild(r);
        const a = t.createElement("input");
        a.type = "password";
        a.value = "";
        a.required = true;
        a.minLength = 8;
        a.maxLength = 30;
        a.spellcheck = false;
        a.placeholder = "Confirm password";
        a.autocomplete = "off";
        ba.appendChild(a);
        const i = t.createElement("input");
        i.id = "tos-check";
        i.type = "checkbox";
        i.required = true;
        ba.appendChild(i);
        {
          const e = t.createElement("label");
          e.htmlFor = "tos-check";
          e.innerHTML = 'I have read and accepted NettleWeb\'s <a href="https://nettleweb.com/terms.html" target="blank" rel="noopener">Terms of Service</a>.';
          ba.appendChild(e);
        }
        const s = t.createElement("button");
        s.type = "button";
        s.className = "pri-button";
        s.innerHTML = "Register";
        ba.appendChild(s);
        const c = t.createElement("div");
        c.tabIndex = 0;
        c.innerHTML = "Login";
        ba.appendChild(c);
        const l = t.createElement("div");
        l.tabIndex = 0;
        l.innerHTML = "Sign in with Google";
        ba.appendChild(l);
        e.onblur = () => {
          const t = e.value.trim().toLowerCase();
          if (t.length > 0) {
            va = e.value = t;
          }
        };
        n.onblur = () => {
          const e = n.value.trim().toLowerCase();
          if (e.length > 0) {
            ya = n.value = e;
          }
        };
        r.onblur = () => {
          const e = r.value;
          if (e.length > 0) {
            wa = e;
          }
        };
        s.onclick = () => {
          const s = va = e.value.trim().toLowerCase();
          if (s.length < 4 || s.length > 20) {
            return void o("The username must be between 4 and 20 characters long.");
          }
          if (!/^[\-a-z0-9]+$/.test(s)) {
            return void o("The username must contain only hyphens, lowercase a-z and 0-9.");
          }
          const c = ya = n.value.trim().toLowerCase();
          if (c.length < 6 || c.length > 320 || c.indexOf("@", 1) < 0) {
            return void o("Please provide a valid email.");
          }
          const d = wa = r.value;
          if (d.length < 8 || d.length > 30) {
            o("The password must be between 8 and 30 characters long.");
          } else if (d === a.value) {
            if (i.checked) {
              h(11, [s, d, c]).then(() => {
                ba.style.display = "none";
                ba.innerHTML = "";
                {
                  const e = t.createElement("h3");
                  e.textContent = "Verify Email";
                  ba.appendChild(e);
                }
                {
                  const e = t.createElement("span");
                  e.textContent = "Please check your inbox and fill in the 6-digit verification code below to verify your email address.";
                  ba.appendChild(e);
                }
                const e = t.createElement("input");
                e.type = "text";
                e.value = "";
                e.required = true;
                e.minLength = 6;
                e.maxLength = 6;
                e.spellcheck = false;
                e.placeholder = "6-digit verification code";
                e.autocomplete = "off";
                ba.appendChild(e);
                const n = t.createElement("button");
                n.type = "button";
                n.className = "pri-button";
                n.textContent = "Verify";
                ba.appendChild(n);
                {
                  const e = t.createElement("span");
                  e.textContent = "Notice: If you are using a managed email address (ie. school or work) and did not receive a code in your inbox after several attempts, the code is likely to be blocked by your administrator. In this case, using a personal account could help.";
                  ba.appendChild(e);
                }
                ba.appendChild(l);
                e.onblur = () => {
                  const t = e.value.trim();
                  if (t.length > 0) {
                    e.value = t;
                  }
                };
                n.onclick = () => {
                  const t = e.value.trim();
                  if (6 === t.length && /^\d+$/.test(t)) {
                    h(17, [s, t]).then(e => {
                      if ("string" == typeof e && 2048 === e.length) {
                        V.send(na.UTF_8.encode("\x01" + (W = e)));
                        z.setItem("__secrets_", e);
                        ga();
                      } else {
                        o("Error: Remote returned invalid token data.");
                      }
                    }).catch(e => {
                      o("Failed to verify your email address. Message: " + e);
                    });
                  } else {
                    o("The code provided must have exactly 6 digits.");
                  }
                };
                ba.style.display = "block";
              }).catch(e => {
                o("Failed to send request. Message: " + e);
              });
            } else {
              o("Please check the checkbox above to accept the Terms of Service.");
            }
          } else {
            o("The confirm password does not match.");
          }
        };
        c.onclick = ka;
        l.onclick = Ta;
        ba.style.display = "block";
      }
      function Ea() {
        ba.style.display = "none";
        ba.innerHTML = "";
        {
          const e = t.createElement("h3");
          e.textContent = "Reset Password";
          ba.appendChild(e);
        }
        const e = t.createElement("input");
        e.type = "email";
        e.value = ya || "";
        e.required = true;
        e.minLength = 6;
        e.maxLength = 320;
        e.spellcheck = false;
        e.placeholder = "Email";
        e.autocomplete = "off";
        ba.appendChild(e);
        const n = t.createElement("button");
        n.type = "button";
        n.className = "pri-button";
        n.textContent = "Continue";
        ba.appendChild(n);
        const r = t.createElement("div");
        r.tabIndex = 0;
        r.textContent = "Login";
        ba.appendChild(r);
        const a = t.createElement("div");
        a.tabIndex = 0;
        a.textContent = "Register";
        ba.appendChild(a);
        const i = t.createElement("div");
        i.tabIndex = 0;
        i.textContent = "Sign in with Google";
        ba.appendChild(i);
        e.onblur = () => {
          const t = e.value.trim().toLowerCase();
          if (t.length > 0) {
            ya = e.value = t;
          }
        };
        n.onclick = () => {
          const n = ya = e.value.trim().toLowerCase();
          if (n.length < 6 || n.length > 320 || n.indexOf("@", 1) < 0) {
            o("Please provide a valid email.");
          } else {
            h(21, n).then(() => {
              ba.style.display = "none";
              ba.innerHTML = "";
              {
                const e = t.createElement("h3");
                e.textContent = "Reset Password";
                ba.appendChild(e);
              }
              {
                const e = t.createElement("span");
                e.textContent = "Please check your inbox and follow the instructions on the email.";
                ba.appendChild(e);
              }
              ba.appendChild(r);
              ba.appendChild(a);
              ba.appendChild(i);
              ba.style.display = "block";
            }).catch(e => {
              o("Failed to send request. Message: " + e);
            });
          }
        };
        r.onclick = ka;
        a.onclick = Ca;
        i.onclick = Ta;
        ba.style.display = "block";
      }
      function Aa(e) {
        if (2048 === e.length) {
          V.send(na.UTF_8.encode("\x01" + (W = e)));
          z.setItem("__secrets_", e);
          z.setItem("__?2fa", "0");
          return void ga();
        }
        ba.style.display = "none";
        ba.innerHTML = "";
        {
          const e = t.createElement("h3");
          e.textContent = "Two-Factor Authentication";
          ba.appendChild(e);
        }
        {
          const e = t.createElement("span");
          e.textContent = "Please open your authenticator app and fill in the generated 6-digit verification code below.";
          ba.appendChild(e);
        }
        const n = t.createElement("input");
        n.type = "text";
        n.value = "";
        n.minLength = 6;
        n.maxLength = 6;
        n.spellcheck = false;
        n.placeholder = "6-digit verification code";
        n.autocomplete = "off";
        ba.appendChild(n);
        const r = t.createElement("button");
        r.type = "button";
        r.className = "pri-button";
        r.textContent = "Verify";
        ba.appendChild(r);
        n.onblur = () => {
          const e = n.value.trim();
          if (e.length > 0) {
            n.value = e;
          }
        };
        r.onclick = () => {
          const t = n.value.trim();
          if (6 === t.length && /^\d+$/.test(t)) {
            h(45, [e, t]).then(e => {
              if ("string" == typeof e && 2048 === e.length) {
                V.send(na.UTF_8.encode("\x01" + (W = e)));
                z.setItem("__secrets_", e);
                z.setItem("__?2fa", "1");
                ga();
              } else {
                o("Error: Remote returned invalid token data.");
              }
            }).catch(e => {
              o("Failed to login with OTP. Message: " + e);
            });
          } else {
            o("The code provided must have exactly 6 digits.");
          }
        };
        ba.style.display = "block";
      }
      function Ta() {
        const t = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        {
          const n = t.searchParams;
          n.set("client_id", "176227430389-qkdboctmfhe9jnvnk2vmarafc5p8amuf.apps.googleusercontent.com");
          n.set("redirect_uri", e.origin + "/auth.html");
          n.set("response_type", "token");
          n.set("state", "12");
          n.set("scope", "email profile");
          n.set("include_granted_scopes", "true");
          n.set("enable_granular_consent", "true");
        }
        C.replace(t);
      }
      {
        const Sa = z.getItem("_cre_") || "";
        if (Sa.length > 0) {
          try {
            const La = await h(0, Sa);
            if ("string" != typeof La) {
              return void o("Error: Remote returned invalid token data.");
            }
            D.click();
            Aa(La);
          } catch (Ia) {
            o("Failed to retrieve login token. Message: " + Ia);
          }
          z.removeItem("_cre_");
        } else {
          ka();
        }
      }
    }
  })(window);
})();