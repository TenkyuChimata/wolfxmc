(function () {
    const MAP_SIZE_TB = 2.6; // <- 地图大小（TiB）在这里改

    function $(id) { return document.getElementById(id); }

    function calcDaysSince(dateStr) {
        const start = new Date(dateStr);
        const now = new Date();
        const diff = now - start;
        return Math.max(0, Math.floor(diff / 86400000));
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(ta);
            return ok;
        }
    }

    function toast(msg) {
        const el = document.createElement("div");
        el.textContent = msg;
        el.style.position = "fixed";
        el.style.left = "50%";
        el.style.bottom = "22px";
        el.style.transform = "translateX(-50%)";
        el.style.padding = "10px 14px";
        el.style.borderRadius = "16px";
        el.style.border = "1px solid rgba(233,236,246,1)";
        el.style.background = "rgba(255,255,255,.92)";
        el.style.backdropFilter = "blur(10px)";
        el.style.color = "rgba(31,42,68,.92)";
        el.style.zIndex = "9999";
        el.style.fontWeight = "800";
        el.style.boxShadow = "0 16px 50px rgba(31, 42, 68, .14)";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1400);
    }

    const I18N = {
        zh: {
            nav_rules: "规则",
            nav_vote: "投票",
            nav_donate: "捐助",
            nav_qq: "QQ群",

            pill: "纯净原版生存 · 地图永不重置 · 永久公益",

            hero_title: `来玩点轻松的生存吧 ☁️<br /><span class="hero-accent">Wolfx Survival</span>`,
            hero_desc: "以原版生存为核心，尽量不改机制。高自由度、少限制，长期稳定运行，自 2019 年持续开放。",

            btn_copy_ip: "复制服务器 IP：Wolfx.jp",
            btn_join_guide: "加入教程 / Join Guide",
            btn_get_mc: "获取 Minecraft",

            stat_status: "状态",
            stat_online: "在线人数",
            stat_version: "支持版本",

            card_quick: "快速信息",
            kv_ip: "服务器 IP",
            kv_server_type: "服务器类型",
            kv_server_type_i18n: "原版生存",
            kv_map_policy: "地图策略",
            kv_runtime: "稳定运行",
            kv_map_never_reset: "永不重置",
            kv_map_size: "地图大小",

            btn_rules: "查看规则",
            btn_vote: "投票支持",

            note: "（小声：先看规则再进服，会更舒服喵～）",

            sec_features_title: "我们坚持的四件事",
            sec_features_desc: "让服务器“简单、干净、长期、好玩”。",

            sec_comm_title: "加入社群 / Community",
            sec_comm_desc: "找队友、晒建筑、看公告、反馈问题，都在这里。",

            discord_title: "Discord",
            discord_desc: "推荐加入：公告 & 讨论更集中。",
            discord_btn: "点击加入 Discord",

            qq_title: "QQ群",
            qq_desc: "国内交流方便，随时随地唠两句。",
            qq_btn: "点击加入 QQ 群",

            footer_runtime_prefix: "服务器已稳定运行",
            footer_runtime_suffix: "天",

            btn_copy: "复制",
            toast_copied: (ip) => `已复制：${ip}`,
            toast_copy_fail: "复制失败（请手动复制）",

            feat1_title: "永不重置",
            feat1_desc: "建筑党放心肝，成果不会突然清空。",
            feat1_tag: "🧱 永不重置",

            feat2_title: "原版优先",
            feat2_desc: "尽量不改机制，红石/农场/探索都更还原。",
            feat2_tag: "🍃 原版优先",

            feat3_title: "保持新版本",
            feat3_desc: "在稳定前提下尽量跟随最新正式版更新。",
            feat3_tag: "✨ 始终最新",

            feat4_title: "少限制高自由",
            feat4_desc: "只要不违反规则，你想怎么玩都可以。",
            feat4_tag: "🎈 高自由度",
        },

        en: {
            nav_rules: "Rules",
            nav_vote: "Vote",
            nav_donate: "Donate",
            nav_qq: "QQ Group",

            pill: "Pure Vanilla · Never Reset · Permanently Free",

            hero_title: `Let’s chill in survival ☁️<br /><span class="hero-accent">Wolfx Survival</span>`,
            hero_desc: "Focused on vanilla survival with minimal changes. High freedom, few restrictions, stable long-term operation since 2019.",

            btn_copy_ip: "Copy Server IP: Wolfx.jp",
            btn_join_guide: "Join Guide",
            btn_get_mc: "Get Minecraft",

            stat_status: "Status",
            stat_online: "Online",
            stat_version: "Supported",

            card_quick: "Quick Info",
            kv_ip: "Server IP",
            kv_server_type: "Type",
            kv_server_type_i18n: "Vanilla Survival",
            kv_map_policy: "Map Policy",
            kv_runtime: "Uptime",
            kv_map_never_reset: "Never Reset",
            kv_map_size: "Map Size",

            btn_rules: "View Rules",
            btn_vote: "Vote Support",

            note: "(psst… read the rules first for a smoother start 🐾)",

            sec_features_title: "What We Stick To",
            sec_features_desc: "Simple, clean, long-term, and fun.",

            sec_comm_title: "Community",
            sec_comm_desc: "Find teammates, share builds, read announcements, and report issues.",

            discord_title: "Discord",
            discord_desc: "Recommended: announcements & discussions in one place.",
            discord_btn: "Join Discord",

            qq_title: "QQ Group",
            qq_desc: "Convenient for CN players & mobile chat.",
            qq_btn: "Join QQ Group",

            footer_runtime_prefix: "Stable uptime:",
            footer_runtime_suffix: "days",

            btn_copy: "Copy",
            toast_copied: (ip) => `Copied: ${ip}`,
            toast_copy_fail: "Copy failed (please copy manually)",

            feat1_title: "Never Reset",
            feat1_desc: "Your builds and progress stay — no periodic map wipes.",
            feat1_tag: "🧱 Never Reset",

            feat2_title: "Vanilla First",
            feat2_desc: "Minimal gameplay changes for a true vanilla survival feel.",
            feat2_tag: "🍃 Vanilla First",

            feat3_title: "Always Updated",
            feat3_desc: "We aim to stay on the latest release while keeping stability.",
            feat3_tag: "✨ Always Updated",

            feat4_title: "High Freedom",
            feat4_desc: "Do anything you want — as long as it follows the rules.",
            feat4_tag: "🎈 High Freedom",
        }
    };

    function detectDefaultLang() {
        const saved = localStorage.getItem("wolfx_lang");
        if (saved === "zh" || saved === "en") return saved;
        const nav = (navigator.language || "").toLowerCase();
        return nav.startsWith("zh") ? "zh" : "en";
    }

    function applyLang(lang) {
        const dict = I18N[lang] || I18N.zh;
        document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

        // plain text
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (!key) return;
            if (dict[key] != null) el.textContent = String(dict[key]);
        });

        // html allowed
        document.querySelectorAll("[data-i18n-html]").forEach((el) => {
            const key = el.getAttribute("data-i18n-html");
            if (!key) return;
            if (dict[key] != null) el.innerHTML = String(dict[key]);
        });

        // mark active button
        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
        });

        localStorage.setItem("wolfx_lang", lang);
    }

    window.addEventListener("DOMContentLoaded", () => {
        // Year
        const yearNow = $("yearNow");
        if (yearNow) yearNow.textContent = String(new Date().getFullYear());

        // Runtime days
        const days = calcDaysSince("2019/5/18");
        const a = $("runtimeDays");
        const b = $("runtimeDaysFooter");
        if (a) a.textContent = String(days);
        if (b) b.textContent = String(days);

        // Map size
        const mapSize = $("mapSizeTB");
        if (mapSize) mapSize.textContent = String(MAP_SIZE_TB);

        // Language init + switch
        const lang = detectDefaultLang();
        applyLang(lang);

        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-lang");
                if (!target) return;
                applyLang(target);
            });
        });

        // Copy IP
        const copyIpBtn = $("copyIpBtn");
        const copyIpMini = $("copyIpMini");
        [copyIpBtn, copyIpMini].forEach((btn) => {
            if (!btn) return;
            btn.addEventListener("click", async () => {
                const ip = btn.getAttribute("data-ip") || "wolfx.jp";
                const ok = await copyText(ip);
                const curLang = detectDefaultLang();
                const dict = I18N[curLang] || I18N.zh;
                toast(ok ? dict.toast_copied(ip) : dict.toast_copy_fail);
            });
        });

        // Mobile menu
        const hamburger = $("hamburger");
        const mobileMenu = $("mobileMenu");
        if (hamburger && mobileMenu) {
            hamburger.addEventListener("click", () => {
                const expanded = hamburger.getAttribute("aria-expanded") === "true";
                hamburger.setAttribute("aria-expanded", String(!expanded));
                mobileMenu.hidden = expanded;
            });

            mobileMenu.addEventListener("click", (e) => {
                const a = e.target.closest("a");
                if (!a) return;
                hamburger.setAttribute("aria-expanded", "false");
                mobileMenu.hidden = true;
            });
        }
    });
})();
