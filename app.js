// ===================================
// Theological Study Application
// ===================================

class TheologicalStudyApp {
    constructor() {
        this.currentPassage = null;
        this.notes = [];
        this.bookmarks = [];
        this.collections = [];
        this.darkMode = false;
        this.bibleCache = {}; // Cache API responses
        this.selectedTranslation = 'kjv'; // Default translation
        this.commentaries = []; // Commentary database
        this.enabledTraditions = ['reformed', 'patristic']; // Default traditions
        this.fontSize = 16; // Default font size
        this.drawerOpen = false;

        // API Keys (get free keys at respective websites)
        this.esvApiKey = '948f99e1f43d00f0d3fef28825fb24022c09a127'; // ESV: https://api.esv.org/
        this.apiBibleKey = ''; // API.Bible: https://scripture.api.bible/ (for future use)
        this.geminiApiKey = ''; // Gemini: https://aistudio.google.com/

        this.init();
    }

    // ===================================
    // Initialization
    // ===================================

    init() {
        this.loadFromStorage();
        this.loadCommentaryDatabase();
        this.setupEventListeners();
        this.initializeDarkMode();
        this.renderNotes();
        this.renderBookmarks();
        this.updateTagFilter();
        this.setupTraditionFilters();
        this.initGeminiUI();
    }

    // ===================================
    // Local Storage Management
    // ===================================

    loadFromStorage() {
        try {
            this.notes = JSON.parse(localStorage.getItem('theologicalNotes')) || [];
            this.bookmarks = JSON.parse(localStorage.getItem('theologicalBookmarks')) || [];
            this.collections = JSON.parse(localStorage.getItem('theologicalCollections')) || [];
            this.darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
            this.currentPassage = JSON.parse(localStorage.getItem('currentPassage')) || null;
            this.selectedTranslation = localStorage.getItem('selectedTranslation') || 'kjv';
            this.fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
            this.geminiApiKey = localStorage.getItem('geminiApiKey') || '';

            // Set translation selector
            const translationSelect = document.getElementById('translationSelect');
            if (translationSelect) {
                translationSelect.value = this.selectedTranslation;
            }

            // Apply font size
            this.applyFontSize();
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.showNotification('Error loading saved data', 'error');
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('theologicalNotes', JSON.stringify(this.notes));
            localStorage.setItem('theologicalBookmarks', JSON.stringify(this.bookmarks));
            localStorage.setItem('theologicalCollections', JSON.stringify(this.collections));
            localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
            localStorage.setItem('currentPassage', JSON.stringify(this.currentPassage));
            localStorage.setItem('selectedTranslation', this.selectedTranslation);
            localStorage.setItem('fontSize', this.fontSize.toString());
            if (this.geminiApiKey) {
                localStorage.setItem('geminiApiKey', this.geminiApiKey);
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
            this.showNotification('Error saving data', 'error');
        }
    }

    // ===================================
    // Event Listeners
    // ===================================

    setupEventListeners() {
        // Dark Mode Toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());

        // Drawer Menu
        document.getElementById('menuToggle').addEventListener('click', () => this.openDrawer());
        document.getElementById('drawerClose').addEventListener('click', () => this.closeDrawer());
        document.getElementById('drawerOverlay').addEventListener('click', () => this.closeDrawer());

        // Drawer Settings
        document.getElementById('drawerDarkModeToggle').addEventListener('change', (e) => {
            if (e.target.checked !== this.darkMode) this.toggleDarkMode();
        });
        document.getElementById('fontSizeDown').addEventListener('click', () => this.changeFontSize(-1));
        document.getElementById('fontSizeUp').addEventListener('click', () => this.changeFontSize(1));
        document.getElementById('drawerTranslation').addEventListener('change', (e) => {
            this.changeTranslation(e.target.value);
            document.getElementById('translationSelect').value = e.target.value;
        });
        document.getElementById('dailyVerseBtn').addEventListener('click', () => this.loadDailyVerse());
        document.getElementById('drawerExportBtn').addEventListener('click', () => { this.exportAllData(); this.closeDrawer(); });
        document.getElementById('drawerClearBtn').addEventListener('click', () => this.confirmClearData());

        // Bottom Navigation
        document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                this.switchSection(target.dataset.section);
            });
        });

        // Sub-tab Navigation (Bible / Commentary)
        document.querySelectorAll('.sub-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSubTab(e.target.dataset.subtab));
        });

        // Translation Selection
        document.getElementById('translationSelect').addEventListener('change', (e) => this.changeTranslation(e.target.value));

        // Passage Navigation
        document.getElementById('searchBtn').addEventListener('click', () => this.searchPassage());
        document.getElementById('passageSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchPassage();
        });
        document.getElementById('quickNavBtn').addEventListener('click', () => this.quickNavigate());

        // Bookmark current passage
        document.getElementById('bookmarkPassageBtn').addEventListener('click', () => this.bookmarkCurrentPassage());

        // Chapter Navigation
        document.getElementById('prevChapterBtn')?.addEventListener('click', () => this.navigateChapter(-1));
        document.getElementById('nextChapterBtn')?.addEventListener('click', () => this.navigateChapter(1));

        // Notes
        document.getElementById('saveNoteBtn').addEventListener('click', () => this.saveNote());
        document.getElementById('clearNoteBtn').addEventListener('click', () => this.clearNoteForm());
        document.getElementById('notesSearchInput').addEventListener('input', (e) => this.searchNotes(e.target.value));
        document.getElementById('tagFilter').addEventListener('change', (e) => this.filterNotesByTag(e.target.value));
        document.getElementById('exportNotesBtn').addEventListener('click', () => this.exportNotes());
        document.getElementById('importNotesBtn').addEventListener('click', () => document.getElementById('importNotesFile').click());
        document.getElementById('importNotesFile').addEventListener('change', (e) => this.importNotes(e));

        // Gemini AI Search
        document.getElementById('saveGeminiKeyBtn').addEventListener('click', () => this.saveGeminiApiKey());
        document.getElementById('changeGeminiKeyBtn').addEventListener('click', () => this.showGeminiKeyForm());
        document.getElementById('geminiSearchBtn').addEventListener('click', () => this.geminiSearchCommentaries());
        document.getElementById('geminiSearchInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) this.geminiSearchCommentaries();
        });
        document.getElementById('drawerSaveGeminiKeyBtn').addEventListener('click', () => this.saveGeminiApiKeyFromDrawer());

        // Collections
        document.getElementById('createCollectionBtn').addEventListener('click', () => this.showCollectionModal());
        document.getElementById('saveCollectionBtn').addEventListener('click', () => this.saveCollection());

        // Modal Close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Click outside modal to close
        document.getElementById('collectionModal').addEventListener('click', (e) => {
            if (e.target.id === 'collectionModal') this.closeModal();
        });
    }

    // ===================================
    // Dark Mode
    // ===================================

    initializeDarkMode() {
        if (this.darkMode) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        }
        this.updateThemeColor();
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.documentElement.classList.toggle('dark-mode');
        document.body.classList.toggle('dark-mode');
        this.updateThemeColor();
        this.saveToStorage();
        // Sync drawer toggle
        const drawerToggle = document.getElementById('drawerDarkModeToggle');
        if (drawerToggle) drawerToggle.checked = this.darkMode;
    }

    updateThemeColor() {
        const metas = document.querySelectorAll('meta[name="theme-color"]');
        const color = this.darkMode ? '#8a3458' : '#c75480';
        metas.forEach(meta => meta.setAttribute('content', color));
    }

    // ===================================
    // Navigation
    // ===================================

    switchSection(sectionName) {
        // Update bottom nav active state
        document.querySelectorAll('.bottom-nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.bottom-nav-btn[data-section="${sectionName}"]`).classList.add('active');

        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

        // Show/hide sub-tabs based on section
        const subTabs = document.getElementById('studySubTabs');
        if (sectionName === 'study') {
            subTabs.classList.remove('hidden');
            // Show whichever sub-tab is active (passage or commentary)
            const activeSubTab = document.querySelector('.sub-tab-btn.active');
            const subTabName = activeSubTab ? activeSubTab.dataset.subtab : 'passage';
            document.getElementById(`${subTabName}Tab`).classList.add('active');
        } else {
            subTabs.classList.add('hidden');
            document.getElementById(`${sectionName}Tab`).classList.add('active');
        }
    }

    switchSubTab(subTabName) {
        // Update sub-tab active state
        document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.sub-tab-btn[data-subtab="${subTabName}"]`).classList.add('active');

        // Hide all study sub-sections, show selected
        document.getElementById('passageTab').classList.remove('active');
        document.getElementById('commentaryTab').classList.remove('active');
        document.getElementById('aisearchTab').classList.remove('active');
        document.getElementById(`${subTabName}Tab`).classList.add('active');
    }

    // ===================================
    // Drawer Menu
    // ===================================

    openDrawer() {
        this.drawerOpen = true;
        const drawer = document.getElementById('drawerMenu');
        const overlay = document.getElementById('drawerOverlay');
        drawer.classList.add('open');
        overlay.classList.remove('hidden');
        // Slight delay for the hidden removal to take effect before opacity transition
        requestAnimationFrame(() => overlay.classList.add('visible'));
        // Sync drawer settings with current state
        document.getElementById('drawerDarkModeToggle').checked = this.darkMode;
        document.getElementById('fontSizeLabel').textContent = this.fontSize;
        document.getElementById('drawerTranslation').value = this.selectedTranslation;
        document.body.style.overflow = 'hidden';
    }

    closeDrawer() {
        this.drawerOpen = false;
        const drawer = document.getElementById('drawerMenu');
        const overlay = document.getElementById('drawerOverlay');
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    }

    // ===================================
    // Font Size
    // ===================================

    changeFontSize(delta) {
        this.fontSize = Math.max(12, Math.min(24, this.fontSize + delta));
        this.applyFontSize();
        document.getElementById('fontSizeLabel').textContent = this.fontSize;
        this.saveToStorage();
    }

    applyFontSize() {
        document.documentElement.style.fontSize = this.fontSize + 'px';
    }

    // ===================================
    // Daily Verse
    // ===================================

    loadDailyVerse() {
        const dailyVerses = [
            'John 3:16', 'Romans 8:28', 'Philippians 4:13', 'Psalm 23:1',
            'Proverbs 3:5', 'Isaiah 40:31', 'Jeremiah 29:11', 'Romans 12:2',
            'Galatians 2:20', 'Ephesians 2:8', '2 Corinthians 5:17', 'Psalm 46:10',
            'Matthew 11:28', 'Romans 5:8', 'Hebrews 11:1', '1 John 4:19',
            'Psalm 119:105', 'James 1:5', 'Colossians 3:23', 'Micah 6:8'
        ];
        // Pick based on day of year for consistency
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const verse = dailyVerses[dayOfYear % dailyVerses.length];

        this.closeDrawer();
        // Navigate to the daily verse
        document.getElementById('passageSearch').value = verse;
        this.switchSection('study');
        this.switchSubTab('passage');
        this.searchPassage();
        this.showToast(`Daily verse: ${verse}`);
    }

    // ===================================
    // Data Export / Clear
    // ===================================

    exportAllData() {
        const data = {
            notes: this.notes,
            bookmarks: this.bookmarks,
            collections: this.collections,
            settings: {
                darkMode: this.darkMode,
                fontSize: this.fontSize,
                translation: this.selectedTranslation
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `theos-lgos-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully');
    }

    confirmClearData() {
        if (confirm('This will permanently delete all notes, bookmarks, and collections. Are you sure?')) {
            this.notes = [];
            this.bookmarks = [];
            this.collections = [];
            this.saveToStorage();
            this.renderNotes();
            this.renderBookmarks();
            this.closeDrawer();
            this.showToast('All data cleared');
        }
    }

    // ===================================
    // Toast Notifications
    // ===================================

    showToast(message, type = 'info') {
        // Remove existing toast if any
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }

    // ===================================
    // Translation Management
    // ===================================

    changeTranslation(translation) {
        this.selectedTranslation = translation;
        this.saveToStorage();

        // Reload current passage if one is loaded
        if (this.currentPassage) {
            this.loadPassage(this.currentPassage);
        }
    }

    // ===================================
    // Passage Navigation
    // ===================================

    searchPassage() {
        const searchTerm = document.getElementById('passageSearch').value.trim();
        if (!searchTerm) return;

        const parsed = this.parsePassageReference(searchTerm);
        if (parsed) {
            this.loadPassage(parsed);
        } else {
            this.showNotification('Invalid passage format. Try "John 3:16" or "Romans 8:28-30"', 'warning');
        }
    }

    quickNavigate() {
        const book = document.getElementById('bookSelect').value;
        const chapter = document.getElementById('chapterInput').value;
        const verse = document.getElementById('verseInput').value;

        if (!book) {
            this.showNotification('Please select a book', 'warning');
            return;
        }

        const reference = {
            book: book,
            chapter: parseInt(chapter) || 1,
            verse: parseInt(verse) || null
        };

        this.loadPassage(reference);
    }

    parsePassageReference(text) {
        // Simple parser for references like "John 3:16" or "Romans 8:28-30"
        const pattern = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+))?(?:-(\d+))?$/;
        const match = text.match(pattern);

        if (!match) return null;

        return {
            book: this.normalizeBookName(match[1].trim()),
            chapter: parseInt(match[2]),
            verse: match[3] ? parseInt(match[3]) : null,
            verseEnd: match[4] ? parseInt(match[4]) : null
        };
    }

    normalizeBookName(name) {
        // Convert book name to lowercase format matching our select options
        return name.toLowerCase().replace(/\s+/g, '');
    }

    async loadPassage(reference) {
        this.currentPassage = reference;
        this.saveToStorage();

        // Update UI
        const bookName = this.getDisplayBookName(reference.book);
        let title = `${bookName} ${reference.chapter}`;
        if (reference.verse) {
            title += `:${reference.verse}`;
            if (reference.verseEnd) {
                title += `-${reference.verseEnd}`;
            }
        }

        document.getElementById('passageTitle').textContent = title;

        // Show loading state
        document.getElementById('passageText').innerHTML = '<div class="placeholder-message"><p>Loading passage...</p></div>';

        // Fetch Bible text from API
        try {
            const bibleText = await this.fetchPassage(reference);
            document.getElementById('passageText').innerHTML = bibleText;
        } catch (error) {
            console.error('Error fetching passage:', error);
            document.getElementById('passageText').innerHTML = this.getErrorMessage(error);
        }

        // Show chapter navigation
        document.getElementById('chapterNav').classList.remove('hidden');

        // Auto-populate note reference field
        document.getElementById('noteReference').value = title;

        // Update commentary display
        this.renderCommentary();
    }

    getDisplayBookName(bookKey) {
        // Convert from key format to display format
        const bookMap = {
            // Old Testament
            'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus',
            'numbers': 'Numbers', 'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua',
            'judges': 'Judges', 'ruth': 'Ruth', '1samuel': '1 Samuel', '2samuel': '2 Samuel',
            '1kings': '1 Kings', '2kings': '2 Kings', '1chronicles': '1 Chronicles',
            '2chronicles': '2 Chronicles', 'ezra': 'Ezra', 'nehemiah': 'Nehemiah',
            'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms', 'proverbs': 'Proverbs',
            'ecclesiastes': 'Ecclesiastes', 'songofsolomon': 'Song of Solomon',
            'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah', 'lamentations': 'Lamentations',
            'ezekiel': 'Ezekiel', 'daniel': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel',
            'amos': 'Amos', 'obadiah': 'Obadiah', 'jonah': 'Jonah', 'micah': 'Micah',
            'nahum': 'Nahum', 'habakkuk': 'Habakkuk', 'zephaniah': 'Zephaniah',
            'haggai': 'Haggai', 'zechariah': 'Zechariah', 'malachi': 'Malachi',
            // New Testament
            'matthew': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John',
            'acts': 'Acts', 'romans': 'Romans', '1corinthians': '1 Corinthians',
            '2corinthians': '2 Corinthians', 'galatians': 'Galatians', 'ephesians': 'Ephesians',
            'philippians': 'Philippians', 'colossians': 'Colossians',
            '1thessalonians': '1 Thessalonians', '2thessalonians': '2 Thessalonians',
            '1timothy': '1 Timothy', '2timothy': '2 Timothy', 'titus': 'Titus',
            'philemon': 'Philemon', 'hebrews': 'Hebrews', 'james': 'James',
            '1peter': '1 Peter', '2peter': '2 Peter', '1john': '1 John',
            '2john': '2 John', '3john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation'
        };
        return bookMap[bookKey] || bookKey.charAt(0).toUpperCase() + bookKey.slice(1);
    }

    // ===================================
    // Bible API Integration
    // ===================================

    async fetchPassage(reference) {
        const bookName = this.getDisplayBookName(reference.book);
        let passageRef = `${bookName} ${reference.chapter}`;

        if (reference.verse) {
            passageRef += `:${reference.verse}`;
            if (reference.verseEnd) {
                passageRef += `-${reference.verseEnd}`;
            }
        }

        // Check cache first (include translation in cache key)
        const cacheKey = `${passageRef}-${this.selectedTranslation}`;
        if (this.bibleCache[cacheKey]) {
            return this.bibleCache[cacheKey];
        }

        // Fetch based on selected translation
        let html;
        switch (this.selectedTranslation) {
            case 'esv':
                html = await this.fetchFromESV(passageRef, reference);
                break;
            case 'lsb':
                html = await this.fetchFromLSB(passageRef, reference);
                break;
            case 'kjv':
            default:
                html = await this.fetchFromBibleAPI(passageRef, reference);
                break;
        }

        // Cache the result
        this.bibleCache[cacheKey] = html;
        return html;
    }

    async fetchFromBibleAPI(passageRef, reference) {
        // Using bible-api.com (free, no auth required)
        const url = `https://bible-api.com/${encodeURIComponent(passageRef)}?translation=kjv`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch passage: ${response.statusText}`);
        }

        const data = await response.json();
        return this.formatBibleAPIResponse(data, reference);
    }

    async fetchFromESV(passageRef, reference) {
        // Using ESV API (requires free API key from https://api.esv.org/)
        if (!this.esvApiKey) {
            return this.getAPIKeyMessage('ESV', 'https://api.esv.org/');
        }

        const url = `https://api.esv.org/v3/passage/html/?q=${encodeURIComponent(passageRef)}&include-passage-references=false&include-verse-numbers=true&include-first-verse-numbers=true&include-footnotes=false&include-headings=false&include-short-copyright=false`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${this.esvApiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`ESV API error: ${response.statusText}`);
        }

        const data = await response.json();
        let html = `<div class="passage-text">${data.passages[0]}</div>`;
        html += '<div class="text-muted" style="margin-top: 1rem; font-size: 0.875rem; line-height: 1.5;">Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.</div>';
        return html;
    }

    async fetchFromLSB(passageRef, reference) {
        // Using bible-api.com with LSB translation (free, no auth required)
        // Note: LSB may not be available on all APIs, will fallback to WEB if needed
        const url = `https://bible-api.com/${encodeURIComponent(passageRef)}?translation=web`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch LSB passage: ${response.statusText}`);
        }

        const data = await response.json();
        // Using WEB (World English Bible) as LSB isn't available on free APIs yet
        return this.formatBibleAPIResponse(data, reference, 'World English Bible (WEB) - LSB coming soon');
    }

    formatBibleAPIResponse(data, reference, translationName = 'King James Version (KJV)') {
        if (!data.verses || data.verses.length === 0) {
            return '<div class="placeholder-message"><p>No verses found for this reference.</p></div>';
        }

        // Filter verses based on the requested reference
        let filteredVerses = data.verses;

        if (reference.verse) {
            // If a specific verse (or range) was requested, filter to only those verses
            filteredVerses = data.verses.filter(v => {
                const verseNum = parseInt(v.verse);
                if (reference.verseEnd) {
                    // Range requested (e.g., Romans 8:28-30)
                    return verseNum >= reference.verse && verseNum <= reference.verseEnd;
                } else {
                    // Single verse requested (e.g., Genesis 1:1)
                    return verseNum === reference.verse;
                }
            });
        }
        // If no specific verse requested (just chapter), show all verses in the chapter

        let html = '<div class="passage-text">';

        filteredVerses.forEach(verse => {
            html += `
                <span class="verse">
                    <sup class="verse-number">${verse.verse}</sup>
                    ${this.escapeHtml(verse.text)}
                </span>
            `;
        });

        html += '</div>';

        // Add attribution
        html += `<div class="text-muted" style="margin-top: 1rem; font-size: 0.875rem;">Translation: ${translationName}</div>`;

        return html;
    }

    getAPIKeyMessage(translationName, apiUrl) {
        return `
            <div class="placeholder-message">
                <p><strong>${translationName} Translation Requires API Key</strong></p>
                <p class="text-muted">To use the ${translationName} translation, you need a free API key.</p>
                <div class="info-box" style="margin-top: 2rem; text-align: left;">
                    <h4>How to get your free ${translationName} API key:</h4>
                    <ol style="margin-left: 1.5rem;">
                        <li>Visit: <a href="${apiUrl}" target="_blank" style="color: var(--accent-primary);">${apiUrl}</a></li>
                        <li>Sign up for a free account</li>
                        <li>Copy your API key</li>
                        <li>Open the app.js file</li>
                        <li>Add your key to the appropriate variable at the top of the file</li>
                        <li>Refresh the app</li>
                    </ol>
                    <p style="margin-top: 1rem;">Or switch to KJV or LSV which work without an API key!</p>
                </div>
            </div>
        `;
    }

    getErrorMessage(error) {
        return `
            <div class="placeholder-message">
                <p style="color: var(--danger);"><strong>Error loading passage</strong></p>
                <p class="text-muted">${this.escapeHtml(error.message)}</p>
                <div class="info-box" style="margin-top: 2rem; text-align: left;">
                    <h4>Troubleshooting:</h4>
                    <ul style="list-style-position: inside;">
                        <li>Check your internet connection</li>
                        <li>Verify the passage reference is correct</li>
                        <li>Try a different chapter or book</li>
                        <li>For ESV API: verify your API key is correct</li>
                    </ul>
                    <p style="margin-top: 1rem;">You can continue using notes and bookmarks while offline.</p>
                </div>
            </div>
        `;
    }

    getPlaceholderText(reference) {
        return `
            <div class="placeholder-message">
                <p><strong>Passage loaded: ${this.getDisplayBookName(reference.book)} ${reference.chapter}${reference.verse ? ':' + reference.verse : ''}</strong></p>
                <p class="text-muted">Bible text will appear here once you add Bible data to the application.</p>
                <p class="text-muted">The application is ready to display verses with proper formatting and verse numbers.</p>
                <div class="info-box" style="margin-top: 2rem; text-align: left;">
                    <h4>To add Bible text:</h4>
                    <ul style="list-style-position: inside;">
                        <li>Option 1: Integrate with a Bible API (e.g., ESV API, Bible Gateway)</li>
                        <li>Option 2: Load a local Bible JSON file</li>
                        <li>Option 3: Use IndexedDB for offline Bible storage</li>
                    </ul>
                    <p style="margin-top: 1rem;">The data structure is ready to receive and display Bible text.</p>
                </div>
            </div>
        `;
    }

    navigateChapter(direction) {
        if (!this.currentPassage) return;

        const newChapter = this.currentPassage.chapter + direction;
        if (newChapter < 1) return;

        this.loadPassage({
            book: this.currentPassage.book,
            chapter: newChapter,
            verse: null
        });
    }

    bookmarkCurrentPassage() {
        if (!this.currentPassage) {
            this.showNotification('No passage selected to bookmark', 'warning');
            return;
        }

        const bookName = this.getDisplayBookName(this.currentPassage.book);
        const reference = `${bookName} ${this.currentPassage.chapter}${this.currentPassage.verse ? ':' + this.currentPassage.verse : ''}`;

        // Check if already bookmarked
        const exists = this.bookmarks.some(b => b.reference === reference);
        if (exists) {
            this.showNotification('Passage already bookmarked', 'warning');
            return;
        }

        const bookmark = {
            id: Date.now(),
            reference: reference,
            passage: this.currentPassage,
            preview: 'Bible text preview will appear here',
            createdAt: new Date().toISOString()
        };

        this.bookmarks.unshift(bookmark);
        this.saveToStorage();
        this.renderBookmarks();
        this.showNotification('Passage bookmarked successfully', 'success');
    }

    // ===================================
    // Notes Management
    // ===================================

    saveNote() {
        const reference = document.getElementById('noteReference').value.trim();
        const tags = document.getElementById('noteTags').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!reference || !content) {
            this.showNotification('Reference and note content are required', 'warning');
            return;
        }

        const note = {
            id: Date.now(),
            reference: reference,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            content: content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(note);
        this.saveToStorage();
        this.renderNotes();
        this.updateTagFilter();
        this.clearNoteForm();
        this.showNotification('Note saved successfully', 'success');
    }

    clearNoteForm() {
        document.getElementById('noteReference').value = '';
        document.getElementById('noteTags').value = '';
        document.getElementById('noteContent').value = '';
    }

    renderNotes(filteredNotes = null) {
        const notesContainer = document.getElementById('notesList');
        const notesToRender = filteredNotes || this.notes;

        if (notesToRender.length === 0) {
            notesContainer.innerHTML = '<div class="placeholder-message"><p>No notes found.</p></div>';
            return;
        }

        notesContainer.innerHTML = notesToRender.map(note => `
            <div class="note-item" data-note-id="${note.id}">
                <div class="note-header">
                    <div class="note-reference">${this.escapeHtml(note.reference)}</div>
                    <div class="note-actions">
                        <button class="icon-btn" onclick="app.editNote(${note.id})" title="Edit note">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="icon-btn" onclick="app.deleteNote(${note.id})" title="Delete note">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                ${note.tags.length > 0 ? `
                    <div class="note-tags">
                        ${note.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="note-content">${this.escapeHtml(note.content)}</div>
                <div class="note-meta">
                    Created: ${new Date(note.createdAt).toLocaleDateString()} at ${new Date(note.createdAt).toLocaleTimeString()}
                </div>
            </div>
        `).join('');
    }

    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        document.getElementById('noteReference').value = note.reference;
        document.getElementById('noteTags').value = note.tags.join(', ');
        document.getElementById('noteContent').value = note.content;

        // Delete the old note (will be replaced when saved)
        this.deleteNote(noteId, false);

        // Scroll to editor
        document.querySelector('.note-editor').scrollIntoView({ behavior: 'smooth' });
    }

    deleteNote(noteId, confirm = true) {
        if (confirm && !window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        this.notes = this.notes.filter(n => n.id !== noteId);
        this.saveToStorage();
        this.renderNotes();
        this.updateTagFilter();
        if (confirm) {
            this.showNotification('Note deleted', 'success');
        }
    }

    searchNotes(query) {
        if (!query.trim()) {
            this.renderNotes();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = this.notes.filter(note =>
            note.reference.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );

        this.renderNotes(filtered);
    }

    filterNotesByTag(tag) {
        if (!tag) {
            this.renderNotes();
            return;
        }

        const filtered = this.notes.filter(note =>
            note.tags.includes(tag)
        );

        this.renderNotes(filtered);
    }

    updateTagFilter() {
        const tagFilter = document.getElementById('tagFilter');
        const allTags = new Set();

        this.notes.forEach(note => {
            note.tags.forEach(tag => allTags.add(tag));
        });

        const sortedTags = Array.from(allTags).sort();

        tagFilter.innerHTML = '<option value="">All Tags</option>' +
            sortedTags.map(tag => `<option value="${this.escapeHtml(tag)}">${this.escapeHtml(tag)}</option>`).join('');
    }

    exportNotes() {
        if (this.notes.length === 0) {
            this.showNotification('No notes to export', 'warning');
            return;
        }

        const dataStr = JSON.stringify(this.notes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `theological-notes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showNotification('Notes exported successfully', 'success');
    }

    importNotes(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error('Invalid format');
                }

                // Merge with existing notes (avoiding duplicates by ID)
                const existingIds = new Set(this.notes.map(n => n.id));
                const newNotes = imported.filter(n => !existingIds.has(n.id));

                this.notes = [...newNotes, ...this.notes];
                this.saveToStorage();
                this.renderNotes();
                this.updateTagFilter();

                this.showNotification(`Imported ${newNotes.length} notes`, 'success');
            } catch (error) {
                this.showNotification('Error importing notes. Check file format.', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    // ===================================
    // Bookmarks & Collections
    // ===================================

    renderBookmarks() {
        const container = document.getElementById('allBookmarksList');

        if (this.bookmarks.length === 0) {
            container.innerHTML = '<div class="placeholder-message"><p>No bookmarks yet. Bookmark passages from the Passage tab.</p></div>';
            return;
        }

        container.innerHTML = this.bookmarks.map(bookmark => `
            <div class="bookmark-item" onclick="app.loadBookmark(${bookmark.id})">
                <div>
                    <div class="bookmark-reference">${this.escapeHtml(bookmark.reference)}</div>
                    <div class="bookmark-preview">${this.escapeHtml(bookmark.preview)}</div>
                </div>
                <div class="bookmark-actions">
                    <button class="icon-btn" onclick="event.stopPropagation(); app.deleteBookmark(${bookmark.id})" title="Delete bookmark">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadBookmark(bookmarkId) {
        const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
        if (!bookmark) return;

        this.loadPassage(bookmark.passage);
        this.switchTab('passage');
    }

    deleteBookmark(bookmarkId) {
        if (!window.confirm('Remove this bookmark?')) return;

        this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
        this.saveToStorage();
        this.renderBookmarks();
        this.showNotification('Bookmark removed', 'success');
    }

    showCollectionModal() {
        document.getElementById('collectionModal').classList.remove('hidden');
        document.getElementById('collectionName').value = '';
        document.getElementById('collectionDescription').value = '';
    }

    closeModal() {
        document.getElementById('collectionModal').classList.add('hidden');
    }

    saveCollection() {
        const name = document.getElementById('collectionName').value.trim();
        const description = document.getElementById('collectionDescription').value.trim();

        if (!name) {
            this.showNotification('Collection name is required', 'warning');
            return;
        }

        const collection = {
            id: Date.now(),
            name: name,
            description: description,
            bookmarks: [],
            createdAt: new Date().toISOString()
        };

        this.collections.push(collection);
        this.saveToStorage();
        this.renderCollections();
        this.closeModal();
        this.showNotification('Collection created', 'success');
    }

    renderCollections() {
        // This would render custom collections
        // Simplified for MVP - can be expanded later
        console.log('Collections:', this.collections);
    }

    // ===================================
    // Commentary System
    // ===================================

    async loadCommentaryDatabase() {
        // Try to load from external JSON file first
        try {
            const response = await fetch('commentaries.json');
            if (response.ok) {
                const data = await response.json();
                this.commentaries = data.map((c, index) => ({
                    ...c,
                    id: c.id || index + 1
                }));
                console.log(`Loaded ${this.commentaries.length} commentary entries from commentaries.json`);
                return;
            }
        } catch (error) {
            console.log('Could not load external commentaries.json, using embedded data');
        }

        // Fallback to embedded commentary if external file not available
        this.commentaries = [
            {
                id: 1,
                reference: 'Romans 8:28',
                tradition: 'reformed',
                author: 'John Calvin',
                source: 'Commentary on Romans',
                year: 1540,
                text: 'We know that all things work together for good for those who love God. This passage teaches us that God\'s providence extends over all things, and that even adversities are turned to the benefit of believers. The "good" here is not temporal prosperity, but spiritual and eternal good - our conformity to Christ and ultimate glorification.'
            },
            {
                id: 2,
                reference: 'John 3:16',
                tradition: 'reformed',
                author: 'Charles Spurgeon',
                source: 'Metropolitan Tabernacle Pulpit',
                year: 1880,
                text: 'God so loved the world - not a select few, not merely the nation of Israel, but the world. Yet this love is effectual only in those who believe. The gift of the Son is universal in its offer, but particular in its application. Whosoever believes shall not perish, and this belief is itself a gift of grace.'
            }
        ];
    }

    setupTraditionFilters() {
        const checkboxes = document.querySelectorAll('.tradition-filters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            // Set initial state
            checkbox.checked = this.enabledTraditions.includes(checkbox.value);

            // Add event listener
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.enabledTraditions.push(e.target.value);
                } else {
                    this.enabledTraditions = this.enabledTraditions.filter(t => t !== e.target.value);
                }
                this.renderCommentary();
            });
        });
    }

    renderCommentary() {
        if (!this.currentPassage) {
            document.getElementById('commentaryDisplay').innerHTML = `
                <div class="placeholder-message">
                    <p>Select a passage to view commentary</p>
                </div>
            `;
            return;
        }

        // Get reference string
        const bookName = this.getDisplayBookName(this.currentPassage.book);
        let referenceStr = `${bookName} ${this.currentPassage.chapter}`;
        if (this.currentPassage.verse) {
            referenceStr += `:${this.currentPassage.verse}`;
        }

        // Debug logging
        console.log('Commentary Filter Debug:');
        console.log('  currentPassage:', this.currentPassage);
        console.log('  referenceStr:', referenceStr);
        console.log('  verse selected:', this.currentPassage.verse);

        // Find matching commentaries
        const matchingCommentaries = this.commentaries.filter(c => {
            // Check if tradition is enabled
            if (!this.enabledTraditions.includes(c.tradition)) {
                return false;
            }

            // Check if reference matches
            // If user selected a specific verse, only show commentary for that exact verse
            if (this.currentPassage.verse) {
                const matches = c.reference === referenceStr;
                console.log(`  Checking "${c.reference}" === "${referenceStr}": ${matches}`);
                return matches;
            }

            // If user selected a chapter (no specific verse), show all commentary in that chapter
            return c.reference.startsWith(`${bookName} ${this.currentPassage.chapter}:`);
        });

        console.log('  Total matching commentaries:', matchingCommentaries.length);

        const display = document.getElementById('commentaryDisplay');

        if (matchingCommentaries.length === 0) {
            display.innerHTML = `
                <div class="placeholder-message">
                    <p>No commentary available for ${referenceStr}</p>
                    <p class="text-muted">Commentary can be added for this passage in the commentary database.</p>
                    <div class="info-box" style="margin-top: 2rem;">
                        <h4>How to add commentary:</h4>
                        <p>Commentary entries can be added to the <code>loadCommentaryDatabase()</code> method in app.js.</p>
                        <p>Future feature: AI-powered synthesis of commentary sources.</p>
                    </div>
                </div>
            `;
            return;
        }

        // Render commentaries with expand/collapse
        display.innerHTML = matchingCommentaries.map((c, index) => {
            const commentaryId = `commentary-${index}`;
            const previewLength = 200;
            const fullText = this.escapeHtml(c.text);
            const needsExpand = c.text.length > previewLength;
            const previewText = needsExpand ? fullText.substring(0, previewLength) + '...' : fullText;

            return `
                <div class="commentary-item">
                    <span class="tradition-badge tradition-${c.tradition}">${this.getTraditionLabel(c.tradition)}</span>
                    <h4 style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${this.escapeHtml(c.author)}</h4>
                    <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">
                        ${this.escapeHtml(c.source)} (${c.year})
                    </p>
                    <div class="commentary-text-wrapper">
                        <p id="${commentaryId}-preview" class="commentary-text ${needsExpand ? '' : 'hidden'}" style="font-family: var(--font-serif); line-height: 1.8;">
                            ${previewText}
                        </p>
                        <p id="${commentaryId}-full" class="commentary-text hidden" style="font-family: var(--font-serif); line-height: 1.8;">
                            ${fullText}
                        </p>
                        ${needsExpand ? `
                            <button class="expand-btn" onclick="app.toggleCommentary('${commentaryId}')" id="${commentaryId}-btn">
                                <span id="${commentaryId}-btn-text">Read more</span>
                                <svg id="${commentaryId}-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-left: 0.25rem; transition: transform 0.2s;">
                                    <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    toggleCommentary(commentaryId) {
        const preview = document.getElementById(`${commentaryId}-preview`);
        const full = document.getElementById(`${commentaryId}-full`);
        const btnText = document.getElementById(`${commentaryId}-btn-text`);
        const icon = document.getElementById(`${commentaryId}-icon`);

        if (preview.classList.contains('hidden')) {
            // Currently showing full, switch to preview
            preview.classList.remove('hidden');
            full.classList.add('hidden');
            btnText.textContent = 'Read more';
            icon.style.transform = 'rotate(0deg)';
        } else {
            // Currently showing preview, switch to full
            preview.classList.add('hidden');
            full.classList.remove('hidden');
            btnText.textContent = 'Read less';
            icon.style.transform = 'rotate(180deg)';
        }
    }

    getTraditionLabel(tradition) {
        const labels = {
            'reformed': 'Reformed',
            'patristic': 'Patristic',
            'catholic': 'Catholic',
            'orthodox': 'Orthodox',
            'mainline': 'Mainline Protestant'
        };
        return labels[tradition] || tradition;
    }

    addCommentary(commentaryData) {
        // Method to add new commentary entries
        const commentary = {
            id: Date.now(),
            reference: commentaryData.reference,
            tradition: commentaryData.tradition,
            author: commentaryData.author,
            source: commentaryData.source,
            year: commentaryData.year || null,
            text: commentaryData.text,
            addedAt: new Date().toISOString()
        };

        this.commentaries.push(commentary);
        // Could save to localStorage here
        // localStorage.setItem('commentaries', JSON.stringify(this.commentaries));
        this.renderCommentary();
        return commentary;
    }

    // ===================================
    // Gemini AI Commentary Search
    // ===================================

    initGeminiUI() {
        const drawerInput = document.getElementById('drawerGeminiKeyInput');
        if (drawerInput && this.geminiApiKey) drawerInput.value = this.geminiApiKey;

        if (this.geminiApiKey) {
            document.getElementById('geminiKeyForm').classList.add('hidden');
            const statusEl = document.getElementById('geminiKeyStatus');
            statusEl.classList.remove('hidden');
            document.getElementById('geminiKeyStatusText').textContent = 'API key saved — ready to search';
        } else {
            document.getElementById('geminiKeyForm').classList.remove('hidden');
            document.getElementById('geminiKeyStatus').classList.add('hidden');
        }
    }

    saveGeminiApiKey() {
        const input = document.getElementById('geminiApiKeyInput');
        const key = input.value.trim();
        if (!key) { this.showNotification('Please enter a valid API key', 'error'); return; }
        this.geminiApiKey = key;
        localStorage.setItem('geminiApiKey', key);
        const drawerInput = document.getElementById('drawerGeminiKeyInput');
        if (drawerInput) drawerInput.value = key;
        this.initGeminiUI();
        this.showNotification('Gemini API key saved', 'success');
    }

    saveGeminiApiKeyFromDrawer() {
        const input = document.getElementById('drawerGeminiKeyInput');
        const key = input.value.trim();
        if (!key) { this.showNotification('Please enter a valid API key', 'error'); return; }
        this.geminiApiKey = key;
        localStorage.setItem('geminiApiKey', key);
        const tabInput = document.getElementById('geminiApiKeyInput');
        if (tabInput) tabInput.value = key;
        this.initGeminiUI();
        this.showNotification('Gemini API key saved', 'success');
    }

    showGeminiKeyForm() {
        document.getElementById('geminiKeyForm').classList.remove('hidden');
        document.getElementById('geminiKeyStatus').classList.add('hidden');
        const input = document.getElementById('geminiApiKeyInput');
        if (input) { input.value = this.geminiApiKey || ''; input.focus(); }
    }

    /**
     * Score commentaries by keyword relevance and return top results.
     * Keeps Gemini token usage lean by only sending the most relevant entries.
     */
    preFilterCommentaries(query, traditions, maxResults = 60) {
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const pool = this.commentaries.filter(c => traditions.includes(c.tradition));
        if (words.length === 0) return pool.slice(0, maxResults);

        const scored = pool.map(c => {
            const haystack = `${c.reference} ${c.author} ${c.source} ${c.text}`.toLowerCase();
            const score = words.reduce((acc, w) => {
                const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                const hits = haystack.match(re);
                return acc + (hits ? hits.length : 0);
            }, 0);
            return { commentary: c, score };
        });

        return scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults)
            .map(s => s.commentary);
    }

    async geminiSearchCommentaries() {
        const query = document.getElementById('geminiSearchInput').value.trim();
        if (!query) { this.showNotification('Please enter a question or topic', 'error'); return; }

        if (!this.geminiApiKey) {
            this.showNotification('Please save your Gemini API key first', 'error');
            document.getElementById('geminiKeyForm').classList.remove('hidden');
            document.getElementById('geminiKeyStatus').classList.add('hidden');
            return;
        }

        const enabledTraditions = Array.from(
            document.querySelectorAll('.ai-tradition-filter:checked')
        ).map(cb => cb.value);

        if (enabledTraditions.length === 0) {
            this.showNotification('Please select at least one tradition to search', 'error');
            return;
        }

        const display = document.getElementById('geminiResults');
        display.innerHTML = `
            <div class="gemini-loading">
                <div class="gemini-spinner"></div>
                <p>Searching commentaries with Gemini...</p>
            </div>`;

        const relevant = this.preFilterCommentaries(query, enabledTraditions, 60);

        if (relevant.length === 0) {
            display.innerHTML = `
                <div class="placeholder-message">
                    <p>No commentaries found in the selected traditions.</p>
                    <p class="text-muted">Try enabling more traditions or broadening your query.</p>
                </div>`;
            return;
        }

        const commentaryBlock = relevant.map(c =>
            `[${c.reference} | ${c.author}, ${c.source} (${c.year || '?'}) | ${c.tradition}]\n${c.text}`
        ).join('\n\n---\n\n');

        const prompt = `You are a theological research assistant. Answer the question below using ONLY the commentary excerpts provided. Do not use outside knowledge.

Question/Topic: "${query}"

Instructions:
1. Synthesize what the commentators collectively say about this topic
2. Note any meaningful agreements or tensions between commentators or traditions
3. Cite specific authors and passages inline (e.g., "Calvin on Romans 8:28 argues...")
4. If no relevant commentary exists, say so clearly

Commentary excerpts:
${commentaryBlock}`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { maxOutputTokens: 2048, temperature: 0.2, topP: 0.9 }
                    })
                }
            );

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('Empty response from Gemini');

            const traditionLabels = enabledTraditions.map(t => this.getTraditionLabel(t)).join(', ');
            const totalInTraditions = this.commentaries.filter(c => enabledTraditions.includes(c.tradition)).length;

            display.innerHTML = `
                <div class="gemini-result-card">
                    <div class="gemini-result-header">
                        <span class="gemini-badge">
                            <svg width="13" height="13" viewBox="0 0 28 28" fill="none" style="margin-right:3px;vertical-align:middle;">
                                <path d="M14 2C14 2 10 9 2 14C10 19 14 26 14 26C14 26 18 19 26 14C18 9 14 2 14 2Z" fill="url(#gr1)"/>
                                <defs><linearGradient id="gr1" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stop-color="#4285F4"/><stop offset="50%" stop-color="#9B59B6"/><stop offset="100%" stop-color="#E91E63"/>
                                </linearGradient></defs>
                            </svg>Gemini 2.0 Flash
                        </span>
                        <span class="gemini-result-meta">${relevant.length} of ${totalInTraditions} commentaries searched · ${traditionLabels}</span>
                    </div>
                    <blockquote class="gemini-result-query">${this.escapeHtml(query)}</blockquote>
                    <div class="gemini-result-body">${this.formatGeminiResponse(text)}</div>
                    <p class="gemini-disclaimer">AI-generated synthesis. Verify citations against the Commentary tab.</p>
                </div>`;

        } catch (error) {
            const isAuthError = /API_KEY|401|403/i.test(error.message);
            display.innerHTML = `
                <div class="gemini-error">
                    <strong>Error:</strong> ${this.escapeHtml(error.message)}
                    ${isAuthError ? '<p style="margin-top:0.5rem;">Check that your API key is correct and has Gemini API access enabled.</p>' : ''}
                </div>`;
        }
    }

    formatGeminiResponse(text) {
        let html = this.escapeHtml(text);
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/^#{1,3}\s+(.+)$/gm, '<h4 class="gemini-section-heading">$1</h4>');
        html = html.split(/\n{2,}/).map(p => {
            p = p.trim();
            if (!p) return '';
            if (p.startsWith('<h4')) return p;
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        }).join('');
        return html;
    }

    // ===================================
    // Utility Functions
    // ===================================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        this.showToast(message, type);
    }
}

// ===================================
// Initialize Application
// ===================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TheologicalStudyApp();
    console.log('Theological Study App initialized');
});
