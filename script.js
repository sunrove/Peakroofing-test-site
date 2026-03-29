document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // Navbar Scroll Morphing
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Intersection Observer for fade-up animations
  const fadeElements = document.querySelectorAll('.fade-up');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // Stat Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        
        const count = () => {
          start += step;
          if (start < target) {
            entry.target.innerText = isDecimal ? start.toFixed(1) : Math.floor(start);
            requestAnimationFrame(count);
          } else {
            entry.target.innerText = target + (entry.target.getAttribute('data-suffix') || '');
          }
        };
        requestAnimationFrame(count);
        statObserver.unobserve(entry.target);
      }
    });
  });

  stats.forEach(stat => statObserver.observe(stat));

  // Chatbot Logic
  const chatBtn = document.getElementById('chatBtn');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  
  if (chatBtn && chatPanel) {
    chatBtn.addEventListener('click', () => {
      chatPanel.classList.toggle('active');
    });

    chatClose.addEventListener('click', () => {
      chatPanel.classList.remove('active');
    });
  }

  let chatStep = 0;
  let leadData = { service: '', name: '', phone: '' };

  window.selectService = function(service) {
    appendMessage(service, 'user');
    leadData.service = service;
    chatStep = 1;
    setTimeout(() => {
      appendMessage("Great! What's your name?", 'bot');
      showInput();
    }, 500);
    document.querySelector('.chat-options').style.display = 'none';
  };

  function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-msg msg-${sender}`;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showInput() {
    const inputArea = document.createElement('div');
    inputArea.className = 'chat-input-area';
    inputArea.innerHTML = `
      <input type="text" id="chatInput" class="chat-input" placeholder="Type here..." />
      <button onclick="submitChat()" class="btn btn-primary" style="padding: 0.5rem 1rem;">Send</button>
    `;
    chatBody.appendChild(inputArea);
    document.getElementById('chatInput').focus();
    
    document.getElementById('chatInput').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        submitChat();
      }
    });
  }

  window.submitChat = function() {
    const input = document.getElementById('chatInput');
    const val = input.value.trim();
    if (!val) return;

    appendMessage(val, 'user');
    input.parentElement.remove();

    if (chatStep === 1) {
      leadData.name = val;
      chatStep = 2;
      setTimeout(() => {
        appendMessage(`Thanks ${val}! What's the best phone number to reach you?`, 'bot');
        showInput();
      }, 500);
    } else if (chatStep === 2) {
      leadData.phone = val;
      chatStep = 3;
      setTimeout(() => {
        appendMessage("Got it! We'll call you back shortly. For faster service, call (972) 847-3201.", 'bot');
        saveLead();
      }, 500);
    }
  };

  function saveLead() {
    localStorage.setItem('apex_lead', JSON.stringify(leadData));
    const subject = encodeURIComponent(`New Lead: ${leadData.name}`);
    const body = encodeURIComponent(`Name: ${leadData.name}\nPhone: ${leadData.phone}\nService Needed: ${leadData.service}`);
    const mailto = `mailto:mike@apexroofingco.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      window.location.href = mailto;
    }, 1500);
  }
});
