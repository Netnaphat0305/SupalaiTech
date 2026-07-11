<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Supalai HR Agent 
**Presented by NPX Team**

🏆 **Honorable Mention Award** - 2025 Campus to Career Tech Experience Program (C2C TechX), Supalai Public Company Limited


📄 **[สไลด์นำเสนอโปรเจกต์ Supalai HR Agent (PDF)](https://github.com/user-attachments/files/29913709/hackathonc2c_supalai.hr.agent_NPX.pdf)**


## 📌 Overview
ระบบจัดการและคัดกรองใบสมัครอัตโนมัติที่ออกแบบมาเพื่อแก้ไขปัญหาการทำงานซ้ำซ้อน และความล่าช้าในกระบวนการสรรหาบุคลากรของ HR โดยระบบจะช่วยจัดการใบสมัครจำนวนมากที่หลั่งไหลมาจากหลากหลายช่องทางเข้าสู่ระบบส่วนกลางอย่างมีประสิทธิภาพ

## 🚀 Key Features (สิ่งที่ระบบทำได้)
* **Automated Data Extraction:** ดึงข้อมูลใบสมัครจากเว็บไซต์และอีเมลอัตโนมัติ
* **Smart Resume Parsing:** อ่านไฟล์เรซูเม่และผลงานเพื่อสกัดแยกข้อมูลที่สำคัญ
* **Candidate Ranking:** จัดกลุ่มและจัดลำดับความเหมาะสมของผู้สมัคร
* **Summarization & Storage:** สรุปผลการคัดเลือกและบันทึกข้อมูลเอกสารเข้าสู่ระบบ

## 🛠️ Technology Stack
* **Qwen-VL:** ใช้สำหรับประมวลผลเหตุผล ขั้นตอน และทำความเข้าใจโครงสร้างของเอกสารหรือรูปภาพ (AI อ่านเรซูเม่ได้จริง)
* **Selenium:** ใช้สำหรับการดึงข้อมูล (Scraping) จากเว็บไซต์และอีเมล
* **LangChain:** ใช้สำหรับประมวลผลและบริหารจัดการ Workflow ทั้งระบบ

## 📈 Business Impact
* **ลดเวลางานเอกสาร HR:** ระบบดึงข้อมูลและคัดแยกประเภทตำแหน่งให้พร้อมในฐานข้อมูล HR เพียงแค่เปิดดูและตัดสินใจ
* **ย่นเวลา Time-to-Shortlist:** ลดระยะเวลาการทำงานจาก "หลายวัน" เหลือเพียง "ไม่กี่ชั่วโมง" โดยสามารถประมวลผลใบสมัครจำนวนมากได้ในไม่กี่นาที
* **คุ้มค่าและปรับขนาดได้ (Scalable & Open Source):** สามารถปรับใช้ได้ตามขนาดขององค์กร โดยเครื่องมือและ LLM ที่ใช้เป็น Open Source ทั้งสิ้น ทำให้เข้าถึงได้โดยไม่มีค่าใช้จ่าย

---

## 💻 Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1LtUKBmNXwedKWOUN9To62J2RDDXu1-oO

### Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   `npm run dev`
