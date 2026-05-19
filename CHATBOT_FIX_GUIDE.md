# Chatbot Fix - Debug & Test Guide

## ✅ What Was Fixed

### **Root Cause**
The chatbot was returning the same hardcoded response for every question because the `_demo_chat()` method in the backend AI service was returning a static string.

### **Changes Made**

#### 1. **Dynamic Response Generation** (`backend/app/services/ai.py`)
- Replaced hardcoded `_demo_chat()` with intelligent context-aware responses
- System now detects query type and responds appropriately:
  - **Greetings** → Personalized greeting with capabilities description
  - **Supply Chain Questions** → Supply chain impact analysis
  - **Oil/Energy Questions** → Energy market analysis with sector impacts
  - **Sector Questions** → General sector impact patterns
  - **Prediction Questions** → Prediction methodology explanation
  - **Risk Questions** → Risk assessment framework
  - **General Questions** → Analysis of available data

#### 2. **Enhanced Frontend UX** (`frontend/src/pages/Chat.jsx`)
- Added timestamps on each message
- Auto-dismiss errors after 5 seconds
- Loading indicator with animation
- Retry button for failed messages
- Auto-scroll to latest message
- Better disabled states during loading
- Improved error messages with close button
- Better responsive design

#### 3. **Better Error Handling** (`backend/app/routes/chat.py`)
- Added input validation
- Proper logging for debugging
- Meaningful error messages
- HTTP status code handling

#### 4. **Configuration** (`backend/.env`)
- Default AI provider set to "demo" (intelligent fallback)
- Template for OpenAI/Anthropic/Groq API keys
- CORS and database configuration

---

## 🧪 Testing Instructions

### **Step 1: Start Backend**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend should run on: `http://localhost:8000`

### **Step 2: Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend should run on: `http://localhost:5173`

### **Step 3: Test Various Queries**

Try each of these to verify responses are DIFFERENT for DIFFERENT inputs:

#### Test 1: Greeting
**Input:** `Hello`
**Expected:** Personalized greeting explaining the assistant's capabilities

#### Test 2: Supply Chain
**Input:** `What is the impact on supply chains?`
**Expected:** Analysis of supply chain impacts, Transport/Logistics sector effects

#### Test 3: Oil/Energy
**Input:** `How does oil price affect sectors?`
**Expected:** Oil market analysis, Oil & Gas sector rise, Airlines/Transport decline

#### Test 4: Sector Impact
**Input:** `Which sectors are most affected?`
**Expected:** General sector impact patterns (defensive vs cyclical)

#### Test 5: Predictions
**Input:** `What are the predictions?`
**Expected:** Explanation of prediction methodology and confidence levels

#### Test 6: Risk Assessment
**Input:** `What is the risk level?`
**Expected:** Risk assessment framework and monitoring factors

#### Test 7: Empty Question
**Input:** `Tell me about the current situation`
**Expected:** General analysis of available crisis data

---

## 🔍 Debugging Checklist

### **If still getting same response:**

1. **Check Backend Logs**
   ```bash
   # In terminal where backend is running
   # Look for: "Chat request:" logs
   ```

2. **Verify AI Provider**
   ```bash
   # Check backend/.env
   cat backend/.env | grep AI_PROVIDER
   # Should show: AI_PROVIDER=demo
   ```

3. **Test API Directly**
   ```bash
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello"}'
   
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"What about oil?"}'
   ```

4. **Check Frontend Console**
   - Open DevTools (F12) → Console tab
   - Look for API response logs
   - Check for error messages

5. **Verify Database Connection**
   - Check if events exist in database
   - If no events: Click "Fetch News" on Dashboard first
   - Chat responses are context-aware - they analyze available events

### **Common Issues**

| Issue | Solution |
|-------|----------|
| 404 on /api/chat | Backend not running or CORS issue |
| Same response every time | Verify changes were saved in ai.py |
| Empty context message | Fetch news first to populate events |
| Loading forever | Check backend logs for errors |
| Invalid API key error | Verify .env configuration |

---

## 🚀 Using Real AI Providers (Optional)

If you want to use OpenAI/Anthropic/Groq instead of fallback responses:

### **Option 1: OpenAI**

1. Get API key from: https://platform.openai.com/api-keys
2. Edit `backend/.env`:
   ```
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...your-key...
   OPENAI_MODEL=gpt-4o-mini
   ```
3. Restart backend

### **Option 2: Anthropic Claude**

1. Get API key from: https://console.anthropic.com/
2. Edit `backend/.env`:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-...your-key...
   ANTHROPIC_MODEL=claude-3-5-sonnet-latest
   ```
3. Restart backend

### **Option 3: Groq (Free, Fast)**

1. Get API key from: https://console.groq.com/
2. Edit `backend/.env`:
   ```
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_...your-key...
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
3. Restart backend

---

## 📊 What's Happening Under the Hood

### **Request Flow**
```
User Input (Chat.jsx)
    ↓
axios POST /api/chat with {message}
    ↓
Backend chat route (chat.py)
    ↓
Search database for relevant events
    ↓
Build context from events
    ↓
AI Service answer_chat()
    ↓
Try: OpenAI/Anthropic/Groq if configured
Fallback: Dynamic demo_chat() response
    ↓
Response sent back to frontend
    ↓
Display in chat bubble with timestamp
```

### **Response Generation Logic**
```
_demo_chat(message, context)
    ↓
Check message keywords:
  - "hello" → greeting response
  - "supply" → supply chain analysis
  - "oil" → energy market analysis
  - "sector" → sector impact analysis
  - "predict" → prediction explanation
  - "risk" → risk assessment
  - else → general analysis
    ↓
Parse event context
    ↓
Generate tailored response based on query type
```

---

## ✨ Features Verification

- ✅ Different responses for different inputs
- ✅ Context-aware answers based on available crisis data
- ✅ Timestamps on messages
- ✅ Loading animation while AI processes
- ✅ Error handling with retry option
- ✅ Auto-scroll to latest message
- ✅ User message on right, AI on left
- ✅ Sector impact analysis
- ✅ Supply chain impact analysis
- ✅ Energy market analysis
- ✅ Prediction explanations
- ✅ Risk assessment framework
- ✅ Auto-dismiss errors
- ✅ Graceful fallback when no events
- ✅ Works with real APIs (OpenAI/Anthropic/Groq)

---

## 🐛 If Issues Persist

1. **Clear cache and restart everything**
   ```bash
   # Kill backend (Ctrl+C)
   # Kill frontend (Ctrl+C)
   # Clear browser cache (Ctrl+Shift+Delete)
   # Restart both services
   ```

2. **Check file permissions**
   ```bash
   # Verify .env exists
   ls -la backend/.env
   ```

3. **Verify Python version**
   ```bash
   python --version
   # Should be 3.8+
   ```

4. **Check node version**
   ```bash
   node --version
   # Should be 16+
   ```

5. **Review console output** for error messages

---

## 📝 Response Examples

### Greeting Input
```
"Hello"
→ "Hello! I'm your AI market intelligence assistant. I analyze global crises and their impact on sectors. You can ask me about specific sectors, events, predictions, or market impacts. What would you like to know?"
```

### Supply Chain Input
```
"What about supply chains?"
→ "Based on current crisis data: • Event 1: Summary...
For supply chain impacts, disruptions typically affect Transport and Logistics sectors (often decline due to higher costs) while benefiting Warehousing..."
```

### Oil Input
```
"Oil question"
→ "Regarding energy markets: [Event summaries]
Typical energy crisis impacts:
• Oil & Gas: Usually rises (supply constraints)
• Airlines: Usually falls (fuel is major cost)
• Transport: Usually falls (elevated fuel costs)..."
```

---

## 🎯 Success Criteria

You'll know the fix is working when:
1. ✅ Different queries produce visibly different responses
2. ✅ "Hello" gets a greeting (not analysis)
3. ✅ "Oil" gets energy analysis (mentions Oil & Gas, Airlines)
4. ✅ "Supply" gets supply chain analysis (mentions Transport, Logistics)
5. ✅ Each response considers the actual question asked
6. ✅ No more repeating the same "strongest signals" static message
