"""Build /chat.js from tools/chatbot/kb.json and tools/chatbot/widget.js.
Run after editing the knowledge base: python3 tools/build_chat.py"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
kb = json.loads((root / 'tools/chatbot/kb.json').read_text())
kb.pop('source', None)
for e in kb['entries']:
    e.pop('who', None)
data = json.dumps(kb, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
js = (root / 'tools/chatbot/widget.js').read_text().replace('__KB__', data, 1)
(root / 'chat.js').write_text(js)
print('chat.js', len(js), 'bytes,', len(kb['entries']), 'answers')
