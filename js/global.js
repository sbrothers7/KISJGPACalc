window.addEventListener('unload', function () {
    window.addEventListener('unload', function () {
        // remove heavy listeners
        document.querySelectorAll('table').forEach(t => {
            const clone = t.cloneNode(false);
            t.parentNode.replaceChild(clone, t);
        });
        document.documentElement.innerHTML = '';
    });
}); // fix memory increase after reload

const isMobile = () => window.innerWidth <= 768;

window.onload = () => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkThemeMq.matches) {
        toggleDarkMode();
    }
    if (getCookie("darkmode") == "true") toggleDarkMode();
    checkVersion();
}

// cookie stuff
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    setCookie("darkmode", document.documentElement.classList.contains("dark"), 365);
}

async function checkVersion() {
    try {
        const res = await fetch('/version.json?t=' + Date.now());
        const { version } = await res.json();

        const stored = sessionStorage.getItem('appVersion');

        if (!stored) {
            sessionStorage.setItem('appVersion', version);
            return;
        }

        if (version !== stored) {
            sessionStorage.setItem('appVersion', version);
            window.location.reload(true);
        }
    } catch (e) { }
}