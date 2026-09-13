/* ============================================
   PORTFOLIO SITE - MAIN APPLICATION SCRIPT
   ============================================ */

(function () {
  "use strict";

  /* ============================================
     1. THREE.JS 3D SCENE
     ============================================ */
  const threeScene = {
    scene: null,
    camera: null,
    renderer: null,
    shape: null,
    particles: null,
    mouse: { x: 0, y: 0 },
    targetRotation: { x: 0, y: 0 },
    animationId: null,

    init() {
      const container = document.getElementById("three-container");
      if (!container || typeof THREE === "undefined") return;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(this.renderer.domElement);

      this.createShape();
      this.createParticles();
      this.addGlowEffect();
      this.bindEvents();
      this.animate();
    },

    createShape() {
      const geometry = new THREE.IcosahedronGeometry(1.2, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      this.shape = new THREE.Mesh(geometry, material);
      this.scene.add(this.shape);
    },

    createParticles() {
      const count = 300;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);
    },

    addGlowEffect() {
      const glowGeometry = new THREE.IcosahedronGeometry(1.5, 1);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      this.shape.add(glow);
    },

    bindEvents() {
      document.addEventListener("mousemove", (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      window.addEventListener("resize", () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });
    },

    animate() {
      this.animationId = requestAnimationFrame(() => this.animate());

      const time = Date.now() * 0.001;

      if (this.shape) {
        this.shape.rotation.x += 0.003;
        this.shape.rotation.y += 0.005;

        this.targetRotation.x += (this.mouse.y * 0.3 - this.targetRotation.x) * 0.05;
        this.targetRotation.y += (this.mouse.x * 0.3 - this.targetRotation.y) * 0.05;

        this.shape.rotation.x += this.targetRotation.x * 0.01;
        this.shape.rotation.y += this.targetRotation.y * 0.01;

        const scale = 1 + Math.sin(time * 0.5) * 0.05;
        this.shape.scale.set(scale, scale, scale);
      }

      if (this.particles) {
        this.particles.rotation.y += 0.0005;
        this.particles.rotation.x += 0.0002;

        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + positions[i]) * 0.001;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      this.renderer.render(this.scene, this.camera);
    },

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
  };

  /* ============================================
     2. MULTI-LANGUAGE (i18n)
     ============================================ */
  const translations = {
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_skills: "Skills",
      nav_projects: "Projects",
      nav_contact: "Contact",
      hero_title: "Full Stack Developer",
      hero_tagline: "Crafting Digital Experiences",
      hero_description:
        "I build modern, performant web applications with clean code and innovative solutions.",
      hero_cta: "View My Work",
      about_title: "About Me",
      about_text:
        "Passionate developer with expertise in building exceptional digital experiences. I love turning complex problems into simple, beautiful, and intuitive solutions.",
      about_stat_projects: "Projects Completed",
      about_stat_clients: "Happy Clients",
      about_stat_experience: "Years Experience",
      skills_title: "My Skills",
      skills_frontend: "Frontend Development",
      skills_backend: "Backend Development",
      skills_tools: "Tools & Technologies",
      projects_title: "My Projects",
      projects_filter_all: "All",
      projects_filter_web: "Web Apps",
      projects_filter_mobile: "Mobile",
      projects_filter_api: "API",
      project_1_title: "E-Commerce Platform",
      project_1_desc: "Full-stack e-commerce solution with payment integration and real-time inventory management.",
      project_2_title: "Task Management App",
      project_2_desc: "Collaborative project management tool with real-time updates and team workflows.",
      project_3_title: "Weather Dashboard",
      project_3_desc: "Beautiful weather application with location-based forecasts and interactive maps.",
      project_4_title: "Social Media API",
      project_4_desc: "RESTful API with authentication, rate limiting, and real-time notifications.",
      project_5_title: "Fitness Tracker",
      project_5_desc: "Cross-platform mobile app for tracking workouts and nutrition goals.",
      project_6_title: "Chat Application",
      project_6_desc: "Real-time messaging platform with end-to-end encryption and media sharing.",
      contact_title: "Get In Touch",
      contact_name: "Your Name",
      contact_email: "Your Email",
      contact_message: "Your Message",
      contact_submit: "Send Message",
      contact_success: "Message sent successfully!",
      footer_text: "All rights reserved.",
      back_to_top: "Back to Top",
      lang_en: "English",
      lang_ru: "Русский",
      lang_kz: "Қазақша",
      skill_html: "HTML5",
      skill_css: "CSS3/SASS",
      skill_js: "JavaScript",
      skill_react: "React",
      skill_vue: "Vue.js",
      skill_node: "Node.js",
      skill_python: "Python",
      skill_db: "Databases",
      skill_git: "Git",
    },
    ru: {
      nav_home: "Главная",
      nav_about: "Обо мне",
      nav_skills: "Навыки",
      nav_projects: "Проекты",
      nav_contact: "Контакты",
      hero_title: "Full Stack Разработчик",
      hero_tagline: "Создаю Цифровой Опыт",
      hero_description:
        "Я создаю современные, производительные веб-приложения с чистым кодом и инновационными решениями.",
      hero_cta: "Посмотреть Работы",
      about_title: "Обо Мне",
      about_text:
        "Страстный разработчик с опытом создания исключительных цифровых решений. Я люблю превращать сложные задачи в простые, красивые и интуитивные решения.",
      about_stat_projects: "Проектов Завершено",
      about_stat_clients: "Довольных Клиентов",
      about_stat_experience: "Лет Опыта",
      skills_title: "Мои Навыки",
      skills_frontend: "Фронтенд Разработка",
      skills_backend: "Бэкенд Разработка",
      skills_tools: "Инструменты и Технологии",
      projects_title: "Мои Проекты",
      projects_filter_all: "Все",
      projects_filter_web: "Веб-приложения",
      projects_filter_mobile: "Мобильные",
      projects_filter_api: "API",
      project_1_title: "E-Commerce Платформа",
      project_1_desc: "Полнофункциональное e-commerce решение с интеграцией платежей и управлением запасами в реальном времени.",
      project_2_title: "Приложение для Задач",
      project_2_desc: "Инструмент совместного управления проектами с обновлениями в реальном времени и рабочими процессами команды.",
      project_3_title: "Погодная Панель",
      project_3_desc: "Красивое приложение погоды с прогнозами на основе местоположения и интерактивными картами.",
      project_4_title: "Social Media API",
      project_4_desc: "RESTful API с аутентификацией, ограничением скорости и уведомлениями в реальном времени.",
      project_5_title: "Фитнес Трекер",
      project_5_desc: "Кроссплатформенное мобильное приложение для отслеживания тренировок и целей питания.",
      project_6_title: "Приложение для Чата",
      project_6_desc: "Платформа обмена сообщениями в реальном времени с сквозным шифрованием и обменом медиа.",
      contact_title: "Свяжитесь со мной",
      contact_name: "Ваше Имя",
      contact_email: "Ваш Email",
      contact_message: "Ваше Сообщение",
      contact_submit: "Отправить",
      contact_success: "Сообщение успешно отправлено!",
      footer_text: "Все права защищены.",
      back_to_top: "Наверх",
      lang_en: "English",
      lang_ru: "Русский",
      lang_kz: "Қазақша",
      skill_html: "HTML5",
      skill_css: "CSS3/SASS",
      skill_js: "JavaScript",
      skill_react: "React",
      skill_vue: "Vue.js",
      skill_node: "Node.js",
      skill_python: "Python",
      skill_db: "Базы Данных",
      skill_git: "Git",
    },
    kz: {
      nav_home: "Басты",
      nav_about: "Мен туралы",
      nav_skills: "Дағдылар",
      nav_projects: "Жобалар",
      nav_contact: "Байланыс",
      hero_title: "Full Stack Әзірлеуші",
      hero_tagline: "Цифрлық Тәжірибе Жасаймын",
      hero_description:
        "Мен таза код және инновациялық шешімдермен заманауи, өнімді веб-қолданбалар жасаймын.",
      hero_cta: "Жұмыстарымды Көру",
      about_title: "Мен туралы",
      about_text:
        "Ерекше цифрлық тәжірибелер жасау тәжірибесі бар құмарлы әзірлеуші. Мен күрделі мәселелерді қарапайым, әдемі және интуитивті шешімдерге айналдыруды жақсы көремін.",
      about_stat_projects: "Аяқталған Жобалар",
      about_stat_clients: "Қанағаттанған Клиенттер",
      about_stat_experience: "Жыл Тәжірибе",
      skills_title: "Менің Дағдыларым",
      skills_frontend: "Фронтенд Әзірлеу",
      skills_backend: "Бэкенд Әзірлеу",
      skills_tools: "Құралдар және Технологиялар",
      projects_title: "Менің Жобаларым",
      projects_filter_all: "Барлығы",
      projects_filter_web: "Веб-қолданбалар",
      projects_filter_mobile: "Мобильді",
      projects_filter_api: "API",
      project_1_title: "E-Commerce Платформасы",
      project_1_desc: "Төлемдерді интеграциялау және нақты уақыттағы инвентаризация басқаруы бар толық e-commerce шешімі.",
      project_2_title: "Тапсырма Бақылау Қолданбасы",
      project_2_desc: "Нақты уақыттағы жаңартулар мен команда жұмыс процестері бар бірлескен жоба басқару құралы.",
      project_3_title: "Ауа райы Панелі",
      project_3_desc: "Орналасқан жерге негізделген болжамдар мен интерактивті карталары бар әдемі ауа райы қолданбасы.",
      project_4_title: "Social Media API",
      project_4_desc: "Авторизациялау, жылдамдықты шектеу және нақты уақыттағы хабарландырулар бар RESTful API.",
      project_5_title: "Фитнес Трекері",
      project_5_desc: "Жаттығуларды және тамақтану мақсаттарын қадағалау үшін кросс-платформалық мобильді қолданба.",
      project_6_title: "Чат Қолданбасы",
      project_6_desc: "Нақты уақыттағы хабарламалар платформасы, төменгі деңгейдегі шифрлау және медиа бөлісу.",
      contact_title: "Байланысыңыз",
      contact_name: "Сіздің Атыңыз",
      contact_email: "Сіздің Email",
      contact_message: "Сіздің Хабарламаңыз",
      contact_submit: "Жіберу",
      contact_success: "Хабарлама сәтті жіберілді!",
      footer_text: "Барлық құқықтар қорғалған.",
      back_to_top: "Жоғары",
      lang_en: "English",
      lang_ru: "Русский",
      lang_kz: "Қазақша",
      skill_html: "HTML5",
      skill_css: "CSS3/SASS",
      skill_js: "JavaScript",
      skill_react: "React",
      skill_vue: "Vue.js",
      skill_node: "Node.js",
      skill_python: "Python",
      skill_db: "Деректер Қорлары",
      skill_git: "Git",
    },
  };

  const i18n = {
    currentLang: "en",

    init() {
      const saved = localStorage.getItem("portfolio-lang");
      if (saved && translations[saved]) {
        this.currentLang = saved;
      }
      this.updatePage();
      this.bindEvents();
    },

    bindEvents() {
      document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.switchLanguage(btn.dataset.langBtn);
        });
      });
    },

    switchLanguage(lang) {
      if (!translations[lang]) return;
      this.currentLang = lang;
      localStorage.setItem("portfolio-lang", lang);
      this.updatePage();
    },

    updatePage() {
      const t = translations[this.currentLang];

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (t[key]) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = t[key];
          } else {
            el.textContent = t[key];
          }
        }
      });

      document.documentElement.lang = this.currentLang;

      document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.langBtn === this.currentLang);
      });
    },

    t(key) {
      const lang = this.currentLang;
      return (translations[lang] && translations[lang][key]) || key;
    },
  };

  /* ============================================
     3. SMOOTH SCROLL
     ============================================ */
  const smoothScroll = {
    lastScrollY: 0,
    ticking: false,
    nav: null,
    sections: [],
    navLinks: [],

    init() {
      this.nav = document.querySelector(".navbar");
      this.sections = document.querySelectorAll("section[id]");
      this.navLinks = document.querySelectorAll(".nav-link[href^='#']");

      this.bindEvents();
      this.onScroll();
    },

    bindEvents() {
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href");
          const target = document.querySelector(targetId);
          if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      });

      window.addEventListener("scroll", () => {
        if (!this.ticking) {
          requestAnimationFrame(() => {
            this.onScroll();
            this.ticking = false;
          });
          this.ticking = true;
        }
      });
    },

    onScroll() {
      const scrollY = window.pageYOffset;

      if (this.nav) {
        if (scrollY > 100) {
          this.nav.classList.add("scrolled");
        } else {
          this.nav.classList.remove("scrolled");
        }

        if (scrollY > this.lastScrollY && scrollY > 200) {
          this.nav.classList.add("nav-hidden");
        } else {
          this.nav.classList.remove("nav-hidden");
        }
      }

      this.lastScrollY = scrollY;

      let current = "";
      this.sections.forEach((section) => {
        const top = section.offsetTop - 150;
        if (scrollY >= top) {
          current = section.getAttribute("id");
        }
      });

      this.navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    },
  };

  /* ============================================
     4. SCROLL ANIMATIONS
     ============================================ */
  const scrollAnimations = {
    init() {
      this.initIntersectionObserver();
      this.initParallax();
      this.initProgressBars();
      this.initCounters();
    },

    initIntersectionObserver() {
      const fadeElements = document.querySelectorAll(".fade-in, .fade-up, .fade-left, .fade-right");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translate(0, 0)";
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      fadeElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";

        if (el.classList.contains("fade-up")) {
          el.style.transform = "translateY(30px)";
        } else if (el.classList.contains("fade-left")) {
          el.style.transform = "translateX(-30px)";
        } else if (el.classList.contains("fade-right")) {
          el.style.transform = "translateX(30px)";
        }

        observer.observe(el);
      });
    },

    initParallax() {
      const hero = document.querySelector(".hero");
      if (!hero) return;

      window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;
        const heroContent = hero.querySelector(".hero-content");
        const heroBg = hero.querySelector(".hero-bg");

        if (heroContent && scrollY < window.innerHeight) {
          heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
          heroContent.style.opacity = 1 - scrollY / window.innerHeight;
        }

        if (heroBg && scrollY < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
      });
    },

    initProgressBars() {
      const bars = document.querySelectorAll(".progress-bar");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const target = bar.dataset.progress || 0;
              this.animateBar(bar, target);
              observer.unobserve(bar);
            }
          });
        },
        { threshold: 0.5 }
      );

      bars.forEach((bar) => observer.observe(bar));
    },

    animateBar(bar, target) {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        bar.style.width = current + "%";
        bar.textContent = Math.round(current) + "%";
      }, 30);
    },

    initCounters() {
      const counters = document.querySelectorAll(".counter");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((counter) => observer.observe(counter));
    },

    animateCounter(counter) {
      const target = parseInt(counter.dataset.target) || 0;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.round(current);
      }, 16);
    },
  };

  /* ============================================
     5. PROJECT FILTERING
     ============================================ */
  const projectFilter = {
    init() {
      const filterBtns = document.querySelectorAll(".filter-btn");
      const projectCards = document.querySelectorAll(".project-card");

      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.dataset.filter;

          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          projectCards.forEach((card) => {
            const category = card.dataset.category;
            const shouldShow = filter === "all" || category === filter;

            if (shouldShow) {
              card.style.display = "";
              card.style.opacity = "0";
              card.style.transform = "scale(0.8)";
              requestAnimationFrame(() => {
                card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
              });
            } else {
              card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
              card.style.opacity = "0";
              card.style.transform = "scale(0.8)";
              setTimeout(() => {
                card.style.display = "none";
              }, 300);
            }
          });
        });
      });
    },
  };

  /* ============================================
     6. CARD INTERACTIONS
     ============================================ */
  const cardInteractions = {
    init() {
      this.initTiltEffect();
      this.initHoverReveal();
      this.initClickToGithub();
    },

    initTiltEffect() {
      const cards = document.querySelectorAll(".project-card, .skill-card");

      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          card.style.transition = "transform 0.1s ease";
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
          card.style.transition = "transform 0.5s ease";
        });
      });
    },

    initHoverReveal() {
      const cards = document.querySelectorAll(".project-card");

      cards.forEach((card) => {
        const desc = card.querySelector(".project-description");
        if (desc) {
          card.addEventListener("mouseenter", () => {
            desc.style.opacity = "1";
            desc.style.transform = "translateY(0)";
          });
          card.addEventListener("mouseleave", () => {
            desc.style.opacity = "0";
            desc.style.transform = "translateY(20px)";
          });
        }
      });
    },

    initClickToGithub() {
      document.querySelectorAll(".project-card[data-github]").forEach((card) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
          const url = card.dataset.github;
          if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
        });
      });
    },
  };

  /* ============================================
     7. LOADING SCREEN
     ============================================ */
  const loadingScreen = {
    init() {
      const loader = document.getElementById("loading-screen");
      if (!loader) return;

      setTimeout(() => {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none";
          document.body.classList.add("loaded");
        }, 500);
      }, 2000);
    },
  };

  /* ============================================
     8. TYPING EFFECT
     ============================================ */
  const typingEffect = {
    element: null,
    texts: [],
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
    timeout: null,

    init() {
      this.element = document.getElementById("typing-text");
      if (!this.element) return;

      this.texts = [
        i18n.t("hero_tagline"),
        "I build web apps",
        "I solve problems",
        "I create experiences",
      ];
      this.type();
    },

    refreshTexts() {
      this.texts = [
        i18n.t("hero_tagline"),
        "I build web apps",
        "I solve problems",
        "I create experiences",
      ];
    },

    type() {
      const currentText = this.texts[this.textIndex];

      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }

      this.element.textContent = currentText.substring(0, this.charIndex);

      let speed = this.isDeleting ? 50 : 100;

      if (!this.isDeleting && this.charIndex === currentText.length) {
        speed = 2000;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        speed = 500;
      }

      this.timeout = setTimeout(() => this.type(), speed);
    },

    destroy() {
      if (this.timeout) clearTimeout(this.timeout);
    },
  };

  /* ============================================
     9. MOBILE MENU
     ============================================ */
  const mobileMenu = {
    isOpen: false,

    init() {
      const hamburger = document.querySelector(".hamburger");
      const navMenu = document.querySelector(".nav-menu");
      const navLinks = document.querySelectorAll(".nav-link");

      if (!hamburger || !navMenu) return;

      hamburger.addEventListener("click", () => {
        this.toggle();
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          this.close();
        });
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      });

      document.addEventListener("click", (e) => {
        if (
          this.isOpen &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          this.close();
        }
      });
    },

    toggle() {
      this.isOpen ? this.close() : this.open();
    },

    open() {
      this.isOpen = true;
      const hamburger = document.querySelector(".hamburger");
      const navMenu = document.querySelector(".nav-menu");
      hamburger.classList.add("active");
      navMenu.classList.add("active");
      document.body.style.overflow = "hidden";
    },

    close() {
      this.isOpen = false;
      const hamburger = document.querySelector(".hamburger");
      const navMenu = document.querySelector(".nav-menu");
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    },
  };

  /* ============================================
     10. CONTACT FORM
     ============================================ */
  const contactForm = {
    init() {
      const form = document.getElementById("contact-form");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.validate(form);
      });

      form.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("blur", () => this.validateField(field));
        field.addEventListener("input", () => {
          field.classList.remove("error");
          const errorEl = field.parentElement.querySelector(".error-message");
          if (errorEl) errorEl.textContent = "";
        });
      });
    },

    validate(form) {
      const fields = form.querySelectorAll("[required]");
      let isValid = true;

      fields.forEach((field) => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.showSuccess(form);
      }
    },

    validateField(field) {
      const value = field.value.trim();
      const errorEl = field.parentElement.querySelector(".error-message");
      let error = "";

      if (!value) {
        error = "This field is required";
      } else if (field.type === "email" && !this.isValidEmail(value)) {
        error = "Please enter a valid email";
      }

      if (error) {
        field.classList.add("error");
        if (errorEl) errorEl.textContent = error;
        return false;
      } else {
        field.classList.remove("error");
        if (errorEl) errorEl.textContent = "";
        return true;
      }
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showSuccess(form) {
      const successMsg = document.createElement("div");
      successMsg.className = "form-success";
      successMsg.textContent = i18n.t("contact_success");
      successMsg.style.cssText =
        "background:#22c55e;color:#fff;padding:1rem;border-radius:8px;margin-top:1rem;text-align:center;animation:fadeIn 0.5s ease";

      form.appendChild(successMsg);
      form.reset();

      setTimeout(() => {
        successMsg.style.opacity = "0";
        successMsg.style.transition = "opacity 0.5s ease";
        setTimeout(() => successMsg.remove(), 500);
      }, 3000);
    },
  };

  /* ============================================
     11. BACK TO TOP
     ============================================ */
  const backToTop = {
    init() {
      const btn = document.getElementById("back-to-top");
      if (!btn) return;

      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 500) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
      });

      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
  };

  /* ============================================
     12. DARK/LIGHT TOGGLE
     ============================================ */
  const themeToggle = {
    init() {
      const btn = document.getElementById("theme-toggle");
      if (!btn) return;

      const saved = localStorage.getItem("portfolio-theme");
      if (saved === "light") {
        document.body.classList.add("light-theme");
        btn.textContent = "🌙";
      } else {
        btn.textContent = "☀️";
      }

      btn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        btn.textContent = isLight ? "🌙" : "☀️";
      });
    },
  };

  /* ============================================
     INITIALIZATION
     ============================================ */
  document.addEventListener("DOMContentLoaded", () => {
    loadingScreen.init();

    setTimeout(() => {
      i18n.init();
      typingEffect.refreshTexts();
      typingEffect.init();
      smoothScroll.init();
      scrollAnimations.init();
      projectFilter.init();
      cardInteractions.init();
      mobileMenu.init();
      contactForm.init();
      backToTop.init();
      themeToggle.init();
      threeScene.init();
    }, 2100);
  });

  window.i18n = i18n;
})();
