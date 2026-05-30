const searchInput = document.getElementById('google-search-input');
const urlInput = document.getElementById('chrome-url-input');
const voiceBtn = document.getElementById('voice-btn');
const tabGoogle = document.getElementById('tab-google');
const tabLuizabeth = document.getElementById('tab-luizabeth');
const googleView = document.getElementById('google-view');
const portfolioView = document.getElementById('portfolio-view');

function switchTab(view) {
    if (view === 'google') {
        tabGoogle.className = "tab-item tab-active";
        tabLuizabeth.className = "tab-item tab-inactive";
        googleView.style.display = "flex";
        portfolioView.style.display = "none";
        urlInput.value = "google.com";
    } else {
        tabLuizabeth.className = "tab-item tab-active";
        tabGoogle.className = "tab-item tab-inactive";
        googleView.style.display = "none";
        portfolioView.style.display = "block";
        urlInput.value = "luizabeth.html";
    }
}

function performSearch(query) {
    const term = query.toLowerCase().trim();
    const toast = document.getElementById('search-toast');
    document.getElementById('toast-term').textContent = query;

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');

        if (term.includes("luizabeth")) {
            tabLuizabeth.classList.remove('hidden');
            switchTab('luizabeth');
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    }, 1200);
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value) {
        performSearch(searchInput.value);
    }
});

// Micrófono — compatible con todos los navegadores modernos
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-VE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let listening = false;

    voiceBtn.title = "Buscar por voz";
    voiceBtn.style.cursor = "pointer";

    voiceBtn.addEventListener('click', () => {
        if (listening) return;
        try {
            recognition.start();
        } catch (e) {
            // Ya estaba corriendo, ignorar
        }
    });

    recognition.onstart = () => {
        listening = true;
        voiceBtn.style.backgroundColor = "#ff000033";
        voiceBtn.title = "Escuchando...";
    };

    recognition.onresult = (e) => {
        const result = e.results[0][0].transcript;
        searchInput.value = result;
        performSearch(result);
    };

    recognition.onerror = (e) => {
        console.warn("Error de reconocimiento de voz:", e.error);
        if (e.error === 'not-allowed') {
            alert("Permiso de micrófono denegado. Actívalo en la configuración del navegador.");
        } else if (e.error === 'no-speech') {
            // No se detectó voz, simplemente ignorar
        }
    };

    recognition.onend = () => {
        listening = false;
        voiceBtn.style.backgroundColor = "transparent";
        voiceBtn.title = "Buscar por voz";
    };
} else {
    // Navegadores sin soporte (Firefox sin flags, Safari < 14.1, etc.)
    voiceBtn.title = "Tu navegador no soporta búsqueda por voz";
    voiceBtn.style.opacity = "0.4";
    voiceBtn.style.cursor = "not-allowed";

    voiceBtn.addEventListener('click', () => {
        alert("Tu navegador no soporta búsqueda por voz.\nUsa Chrome, Edge o Safari para esta función.");
    });
}
