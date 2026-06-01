import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = {
  servers: [
    { id: 1, name: 'الخادم المحلي', host: '127.0.0.1', port: '3306', database: 'sabamart_db', user: 'root', status: 'active' }
  ],
  logs: [
    { id: 1, action: 'تهيئة النظام', details: 'سبأمارت جاهز للعمل', time: new Date().toISOString() }
  ]
};

app.post('/api/login', (req, res) => {
  const { userId, password } = req.body;
  if (userId === '1' && password === 'SYS_admin@2026') {
    db.logs.unshift({ id: Date.now(), action: 'تسجيل دخول', details: 'مسؤول النظام', time: new Date().toISOString() });
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'بيانات غير صحيحة' });
});

app.get('/api/servers', (req, res) => res.json(db.servers));
app.post('/api/servers', (req, res) => {
  db.servers.push({ id: Date.now(), ...req.body, status: 'active' });
  db.logs.unshift({ id: Date.now(), action: 'إضافة سيرفر', details: req.body.name, time: new Date().toISOString() });
  res.json({ success: true });
});
app.delete('/api/servers/:id', (req, res) => {
  db.servers = db.servers.filter(s => s.id != req.params.id);
  db.logs.unshift({ id: Date.now(), action: 'حذف سيرفر', details: 'ID: ' + req.params.id, time: new Date().toISOString() });
  res.json({ success: true });
});

const ACTIONS = ['فتح قاعدة بيانات جديدة','تحديث قاعدة البيانات','استرجاع نسخة احتياطية','تحديث جداول العملاء','تحديث جدول الموردين','تحديث المخزون والاصناف','تحديث العملات','تحديث القيود اليومية','تحديث الارصدة والجورنال','تحديث تسلسل المستندات','إعادة ترحيل المستندات','إلغاء ترحيل الفواتير','حل المشاكل (Fix)','فحص المعلقات','فحص التحويلات بين الفروع','تحديث التقارير','إنشاء قاعدة بيانات اختبار'];
app.post('/api/action/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  if (!ACTIONS.includes(name)) return res.status(400).json({ error: 'إجراء غير معروف' });
  db.logs.unshift({ id: Date.now(), action: name, details: 'تم التنفيذ بنجاح', time: new Date().toISOString() });
  res.json({ success: true, message: '✅ تم: ' + name });
});

app.get('/api/logs', (req, res) => res.json(db.logs));

const PORT = 3000;
app.listen(PORT, () => console.log('🚀 سبأمارت يعمل على المنفذ ' + PORT));