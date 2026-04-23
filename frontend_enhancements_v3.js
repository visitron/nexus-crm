// Enhanced JavaScript for index.html - Modules 2, 3, 4
// Add these to the existing index_enhanced.html file

const API_CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbwZGIFrZNBBAmd6RXyr_ndFkjQUZEYUMx6WSA-DW70tYFwRM1Kko3mQAWNmKvFjxCH0oQ/exec'
};

// ===============================
// MODULE 2: ENHANCED LEAD CARD UI
// ===============================

/**
 * Create enhanced lead card with:
 * - Direct email/phone display with [COPY] buttons
 * - Product interest display
 * - Interest level color-coded bar
 * - Improved visual hierarchy
 */
function createEnhancedLeadCard(lead) {
  const email = lead.email1 || lead.email || '';
  const company = lead.companyName || lead.company_name || lead.name || lead.city || '';
  const contactPhone = lead.phone || lead.contactPersonMobile || '';
  const interestLevel = Number(lead.interestLevel || lead.rating || 0);
  const productInterest = lead.productsInterested || lead.product || lead.keyword || '';
  const isDue = lead.followupDate && new Date(lead.followupDate) <= new Date();
  const card = document.createElement('div');
  card.className = 'lead-card p-4 cursor-pointer relative';
  card.onclick = () => showLeadDetail(lead);

  const statusClasses = {
    'new': 'status-new', 'interested': 'status-interested', 'qualified': 'status-qualified',
    'proposal': 'status-proposal', 'won': 'status-won', 'lost': 'status-lost'
  };
  const statusLabel = { 'new': 'New', 'interested': 'Interested', 'qualified': 'Qualified', 'proposal': 'Proposal', 'won': 'Won', 'lost': 'Lost' };
  const interestColor = `interest-${Math.min(10, Math.max(1, interestLevel))}`;

  // MODULE 2: Display last contacted date
  const lastContactedDisplay = lead.lastContactDate 
    ? `Last: ${new Date(lead.lastContactDate).toLocaleDateString()}` 
    : 'Never contacted';

  card.innerHTML = `
    ${isDue ? '<div class="due-badge">!</div>' : ''}
    
    <!-- Header with company name and status -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="font-bold text-base">${escapeHTML(lead.name)}</h3>
        <p class="text-xs text-gray-400 mb-1">${escapeHTML(company)}</p>
        <p class="text-xs text-gray-500 font-medium">${lastContactedDisplay}</p>
      </div>
      <span class="px-2 py-1 rounded text-xs font-semibold ${statusClasses[lead.status] || 'status-new'}">
        ${statusLabel[lead.status] || 'New'}
      </span>
    </div>

    <!-- Contact Information with COPY buttons (MODULE 2) -->
    <div class="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-sm flex-1">
          <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span class="text-gray-700 font-medium truncate">${escapeHTML(email)}</span>
        </div>
        <button onclick="copyToClipboard(event, '${email}')" class="btn-copy text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
          COPY
        </button>
      </div>
      
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-sm flex-1">
          <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <span class="text-gray-700 font-medium truncate">${escapeHTML(contactPhone)}</span>
        </div>
        <button onclick="copyToClipboard(event, '${contactPhone}')" class="btn-copy text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
          COPY
        </button>
      </div>
    </div>

    <!-- Product & Interest (MODULE 2) -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-semibold text-gray-600">PRODUCT INTEREST</p>
        <span class="text-xs font-bold ${interestColor} px-2 py-1 rounded-full">
          ${interestLevel}/10
        </span>
      </div>
      <p class="text-sm font-medium text-gray-800 mb-2">${escapeHTML(productInterest)}</p>
      <!-- Interest level visual bar -->
      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div style="width: ${interestLevel * 10}%; background: linear-gradient(90deg, #3b82f6, #10b981);" class="h-2 rounded-full transition-all duration-300"></div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex gap-2 pt-2 border-t border-gray-200">
      <button onclick="dialLead(event, '${contactPhone}')" class="flex-1 action-btn text-xs font-medium py-2 hover:bg-green-50 text-green-600 rounded" title="Call">
        ☎️ Call
      </button>
      <button onclick="whatsappLead(event, '${contactPhone}')" class="flex-1 action-btn text-xs font-medium py-2 hover:bg-green-50 text-green-600 rounded" title="WhatsApp">
        💬 Chat
      </button>
      <button onclick="emailLead(event, '${email}')" class="flex-1 action-btn text-xs font-medium py-2 hover:bg-blue-50 text-blue-600 rounded" title="Email">
        ✉️ Email
      </button>
      <button onclick="mapLead(event, '${lead.city}')" class="flex-1 action-btn text-xs font-medium py-2 hover:bg-red-50 text-red-600 rounded" title="Maps">
        📍 Map
      </button>
    </div>
  `;

  return card;
}

// ===============================
// MODULE 3: ANDROID JAVA BRIDGE
// ===============================

/**
 * Android WebView Bridge Interface
 * Called from Java: Android_CRM_App.js.syncFromAndroid(logData)
 * 
 * Data Format: { phoneNumber, duration, callTime }
 * 
 * Usage in Java:
 * webView.addJavascriptInterface(new JavaScriptInterface(), "AndroidApp");
 * Then call: webView.evaluateJavascript("javascript:window.syncFromAndroid(...)", null);
 */
window.syncFromAndroid = async function(logData) {
  try {
    console.log('📱 Android Bridge: Incoming call log', logData);
    
    // Validate data
    if (!logData.phoneNumber || !logData.duration) {
      console.error('❌ Invalid call log data: missing required fields');
      return { success: false, error: 'Missing phoneNumber or duration' };
    }
    
    // Send to backend via API
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'androidCallSync',
        userId: state.user.id,
        payload: {
          phoneNumber: logData.phoneNumber,
          duration: parseInt(logData.duration),
          callTime: logData.callTime || new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Call log synced:', result.callId);
      
      // Update UI
      showToast(`Call logged: ${logData.duration}min with ${logData.phoneNumber}`);
      
      // Refresh leads if on home page
      if (state.currentPage === 'home') {
        renderHome();
      }
      
      return { success: true, callId: result.callId };
    } else {
      console.error('❌ Sync failed:', result.message);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('❌ Android Bridge Error:', error);
    return { success: false, error: error.toString() };
  }
};

/**
 * Session time tracking for Module 3
 * Logs app usage duration when user closes tab or logs out
 */
let sessionStartTime = Date.now();

window.addEventListener('beforeunload', async function() {
  const sessionDurationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
  
  try {
    await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'logSessionUsage',
        userId: state.user.id,
        payload: {
          sessionDurationSeconds,
          endTime: new Date().toISOString()
        }
      })
    }).catch(() => {}); // Ignore errors during unload
  } catch (error) {
    console.warn('Session logging failed:', error);
  }
});

// ===============================
// MODULE 4: CONVERSATION LOGGING & ENHANCED LLM
// ===============================

/**
 * Log conversation to backend Conversations sheet
 * 
 * Captures all interactions with full context:
 * - Email exchange
 * - Phone call discussion
 * - Meeting notes
 * - Chat/message
 * 
 * This creates an audit trail and enables AI to understand communication history
 */
async function logConversationToBackend(leadId, product, description, interactionType = 'general') {
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'logConversation',
        userId: state.user.id,
        payload: {
          leadId,
          product,
          description,
          interactionType,
          timestamp: new Date().toISOString()
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Conversation logged:', result.conversationId);
      return result;
    } else {
      console.error('❌ Conversation log failed:', result.message);
      return { success: false };
    }
  } catch (error) {
    console.error('Conversation logging error:', error);
    return { success: false };
  }
}

/**
 * Enhanced email sending with conversation logging
 * Now logs the email interaction automatically
 */
function sendEmailWithLogging(leadId, to, subject, body, product) {
  return new Promise(async (resolve) => {
    try {
      // Send email
      const emailResult = await syncToBackend('sendEmail', {
        leadId,
        to,
        subject,
        body
      });

      if (emailResult.success) {
        // Log conversation
        await logConversationToBackend(
          leadId,
          product || 'General Inquiry',
          `Email sent: ${subject}\n\n${body.substring(0, 100)}...`,
          'email_sent'
        );

        showToast('Email sent and logged');
        resolve(true);
      } else {
        showToast('Failed to send email');
        resolve(false);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      resolve(false);
    }
  });
}

/**
 * CONTEXTUAL LLM - Generate proposal with product details
 * 
 * Enhanced Algorithm:
 * 1. Get lead details and last conversation
 * 2. Get product details from Product_Catalog (includes URL)
 * 3. Build context-aware prompt
 * 4. Call LLM with full context
 * 5. Generate proposal-ready content
 * 6. Log the AI interaction as a conversation
 */
async function generateContextualProposal(leadId, productName) {
  try {
    const lead = state.allLeads.find(l => l.id === leadId);
    if (!lead) {
      showToast('Lead not found');
      return null;
    }

    // Build comprehensive prompt for LLM
    const prompt = `Generate a professional, personalized proposal letter for ${lead.name} at ${lead.companyName || 'their school'} in ${lead.city}.

Lead Information:
- Company: ${lead.companyName}
- Contact: ${lead.contactPerson}
- Category: ${lead.category}
- Last Contacted: ${lead.lastContactDate || 'Never'}
- Current Interest Level: ${lead.interestLevel}/10

Product: ${productName}

Please create a compelling, proposal-ready letter that:
1. Opens with personalization (mention their school/category)
2. Explains how the product solves their specific needs
3. Includes pricing/options relevant to schools
4. Calls to action with specific next steps
5. Professional tone suitable for decision makers

Format as ready-to-send email content.`;

    // Show loading indicator
    showToast('Generating proposal...');

    // Call contextual LLM endpoint
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'contextualLLM',
        userId: state.user.id,
        payload: {
          leadId,
          product: productName,
          prompt
        },
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();

    if (result.success) {
      // Log the AI-generated proposal as a conversation
      await logConversationToBackend(
        leadId,
        productName,
        `AI-Generated Proposal:\n\n${result.content.substring(0, 150)}...`,
        'ai_generated_proposal'
      );

      // If product URL is included, highlight it
      if (result.productUrl) {
        console.log(`📎 Product URL included: ${result.productUrl}`);
      }

      return result.content;
    } else {
      showToast('Failed to generate proposal');
      return null;
    }
  } catch (error) {
    console.error('❌ Proposal generation error:', error);
    showToast('Error generating proposal');
    return null;
  }
}

/**
 * Enhanced send email modal with conversation logging
 * Integrates contextual LLM for proposal drafting
 */
function sendEmailToLeadWithContext(leadId) {
  const lead = state.allLeads.find(l => l.id === leadId);
  if (!lead) return;

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<div class="modal-content">
    <h3 class="font-bold text-lg mb-4">Send Email to ${escapeHTML(lead.name)}</h3>
    
    <div class="space-y-3 mb-4">
      <!-- Product Selection -->
      <div>
        <label class="form-label">Product/Service</label>
        <select id="email-product" class="form-input">
          <option value="">-- Select Product --</option>
          ${state.products.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
        </select>
      </div>

      <!-- Template Selection -->
      <div>
        <label class="form-label">Template</label>
        <select id="template-select" class="form-input">
          <option value="">-- Choose Template --</option>
          ${state.emailTemplates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
      </div>

      <!-- To Field -->
      <div>
        <label class="form-label">To</label>
        <input type="email" class="form-input" value="${lead.email1}" readonly>
      </div>

      <!-- Subject -->
      <div>
        <label class="form-label">Subject</label>
        <input type="text" id="email-subject" class="form-input" placeholder="Email subject...">
      </div>

      <!-- Body -->
      <div>
        <label class="form-label">Message</label>
        <textarea id="email-body" class="form-input" rows="6" placeholder="Write your message..."></textarea>
      </div>

      <!-- AI Generate Button -->
      <button onclick="generateEmailWithAI('${leadId}')" class="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
        ✨ Generate with AI (Contextual)
      </button>
    </div>

    <div class="flex gap-3">
      <button onclick="this.closest('.modal').remove()" class="flex-1 btn-secondary">Cancel</button>
      <button onclick="doSendEmailWithLogging('${leadId}')" class="flex-1 btn-primary">
        Send & Log
      </button>
    </div>
  </div>`;

  document.body.appendChild(modal);

  // Template selection handler
  document.getElementById('template-select').addEventListener('change', (e) => {
    if (e.target.value) {
      const tpl = state.emailTemplates.find(t => t.id === e.target.value);
      document.getElementById('email-subject').value = tpl.subject.replace('{product}', document.getElementById('email-product').value || 'Our Solution');
      document.getElementById('email-body').value = tpl.body
        .replace('{name}', lead.name)
        .replace('{product}', document.getElementById('email-product').value || 'Our Service')
        .replace('{sender}', state.user.name);
    }
  });
}

/**
 * Generate email using contextual LLM with product details
 */
async function generateEmailWithAI(leadId) {
  const product = document.getElementById('email-product').value;
  
  if (!product) {
    showToast('Please select a product first');
    return;
  }

  const proposal = await generateContextualProposal(leadId, product);
  
  if (proposal) {
    document.getElementById('email-subject').value = `Special Offer: ${product} for Your School`;
    document.getElementById('email-body').value = proposal;
    showToast('Proposal generated! Review and send.');
  }
}

/**
 * Send email with automatic conversation logging
 */
async function doSendEmailWithLogging(leadId) {
  const subject = document.getElementById('email-subject').value;
  const body = document.getElementById('email-body').value;
  const product = document.getElementById('email-product').value;
  const lead = state.allLeads.find(l => l.id === leadId);

  if (!subject || !body) {
    showToast('Fill in all fields');
    return;
  }

  const success = await sendEmailWithLogging(leadId, lead.email1, subject, body, product);
  
  if (success) {
    document.querySelector('.modal').remove();
  }
}

// ===============================
// UTILITY: Enhanced Copy Button Handler
// ===============================

/**
 * Enhanced copy handler with visual feedback
 */
function copyToClipboard(event, text) {
  event.stopPropagation();
  
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback on button
    const btn = event.target.closest('.btn-copy');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ COPIED';
      btn.classList.add('bg-green-100', 'text-green-700');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('bg-green-100', 'text-green-700');
      }, 1500);
    }
    
    showToast('Copied to clipboard!');
  }).catch(err => {
    console.error('Copy failed:', err);
    showToast('Copy failed');
  });
}

// ===============================
// INTEGRATION: Add to existing state
// ===============================

// Update state to include conversation tracking
if (typeof state !== 'undefined') {
  state.conversationHistory = [];
  state.sessionStartTime = Date.now();
}

// Override renderLeads to use enhanced card
function renderLeadsEnhanced() {
  if (typeof state === 'undefined' || !state.filteredLeads) return;
  const container = document.getElementById('leads-container');
  if (!container) return;
  container.innerHTML = '';

  if (state.filteredLeads.length === 0) {
    container.innerHTML = `<div class="text-center py-12">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
      <p class="text-gray-500 font-medium">No leads found</p>
      <p class="text-sm text-gray-400">Try adjusting your filters or import new data</p>
    </div>`;
    return;
  }

  state.filteredLeads.forEach(lead => {
    const card = createEnhancedLeadCard(lead);
    container.appendChild(card);
  });
}

// Override renderHome to use enhanced leads
const originalRenderHome = window.renderHome;
if (typeof window.renderHome === 'function') {
  window.renderHome = function() {
    if (typeof applyFilters === 'function') applyFilters();
    renderLeadsEnhanced();
    if (typeof updateStats === 'function') updateStats();
  };
}
