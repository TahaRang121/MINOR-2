# 🚀 Quick Start: Testing the Fixed Chatbot

## 30-Second Setup

### Terminal 1 - Backend
```bash
cd c:\A\Development\MINOR-2\backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
✅ Backend running on: http://localhost:8000

### Terminal 2 - Frontend
```bash
cd c:\A\Development\MINOR-2\frontend
npm install
npm run dev
```
✅ Frontend running on: http://localhost:5173

---

## Test the Fix (5 Queries)

Go to: http://localhost:5173 → Click "Chat" tab

### Query 1: Greeting
**Type:** `Hello`
**Expected:** Greeting message explaining capabilities
**Status:** ✅ PASS if response is personalized greeting

### Query 2: Oil/Energy
**Type:** `How does oil affect markets?`
**Expected:** Energy analysis mentioning Oil & Gas rise, Airlines fall
**Status:** ✅ PASS if different from Query 1

### Query 3: Supply Chain
**Type:** `What about supply chains?`
**Expected:** Supply chain impact analysis
**Status:** ✅ PASS if different from Query 2

### Query 4: Sectors
**Type:** `Which sectors are affected?`
**Expected:** Sector impact patterns explanation
**Status:** ✅ PASS if different from Query 3

### Query 5: General
**Type:** `Tell me more`
**Expected:** General analysis of available data
**Status:** ✅ PASS if contextual response

---

## Expected Results

| Input | Response Type | Key Indicators |
|-------|---------------|-----------------|
| `Hello` | Greeting | "capabilities", "ask me about" |
| `oil` | Energy | "Oil & Gas", "Airlines", "Transport" |
| `supply` | Supply Chain | "disruptions", "Logistics", "Warehousing" |
| `sector` | Sector Analysis | "defensive", "cyclical", "uncertainty" |
| `tell me more` | General | "crisis context", "patterns" |

**Result:** All 5 responses should be **visibly different**.

---

## Success Confirmation

✅ **FIX IS WORKING IF:**
- Every query produces a unique response
- "Hello" is clearly a greeting
- "oil" specifically mentions energy sectors
- "supply" specifically mentions supply chain sectors
- Timestamps appear on messages
- No repeated "strongest signals" message

❌ **FIX NOT WORKING IF:**
- All responses are the same
- Still getting generic "strongest signals" message
- Same response for different questions

---

## If Something's Wrong

### Check Backend is Running
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

### Check Frontend is Running
```bash
# Navigate to http://localhost:5173
# Should see the app interface
```

### Check API Communication
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
# Should return JSON with "answer" field
```

### Check Browser Console
Open DevTools (F12) → Console → Look for API responses

### Check Backend Logs
Look for "Chat request:" messages in backend terminal

---

## Files Modified

✅ `backend/app/services/ai.py` - Replaced `_demo_chat()` with dynamic logic
✅ `frontend/src/pages/Chat.jsx` - Enhanced UX with timestamps, errors, retry
✅ `backend/app/routes/chat.py` - Added logging and error handling
✅ `backend/.env` - Created configuration file

---

## Advanced: Use Real API

To use OpenAI/Claude/Groq instead of fallback:

1. Get API key from provider
2. Edit `backend/.env` with your key
3. Set `AI_PROVIDER=openai` (or anthropic, groq)
4. Restart backend

Example for OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

---

## Common Questions

**Q: How often should responses be different?**
A: Every single query that's reasonably different should get a unique response.

**Q: What if I don't have crisis events in the database?**
A: Click "Fetch News" on Dashboard first to populate events.

**Q: Is the fallback slower than real APIs?**
A: No, fallback is actually faster (instant, no API call).

**Q: Can I switch between demo and real API?**
A: Yes, just change `.env` and restart backend.

---

## Timeline

- ⏱️ **0-5 min:** Start backend and frontend
- ⏱️ **5-10 min:** Test 5 queries
- ⏱️ **10-15 min:** Verify all responses are different
- ✅ **DONE:** Chatbot is fixed!

---

## Support Resources

- **Debug Guide:** See `CHATBOT_FIX_GUIDE.md`
- **Full Summary:** See `CHATBOT_FIX_SUMMARY.md`
- **Code Changes:** Modified files listed above
- **Test Script:** Run `python test_chat_responses.py` (after installing deps)
