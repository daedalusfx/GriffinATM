# 🦅 GriffinATM

### یک پنل معاملاتی مدرن و هوشمند برای MetaTrader 5

### A Modern and Smart Trade Manager for MetaTrader 5



---

![Logo](/assets/icon.jpg)


![Preview](/screenshots/preview.png)


---


## فارسی

**GriffinATM** یک پنل مدیریتی پیشرفته برای معاملات در پلتفرم MetaTrader 5 است که با هدف ترکیب رابط کاربری سریع، زیبا و هیبریدی با قدرت موتور معاملاتی MQL5 طراحی شده است. این ابزار، کنترل کامل و دقیق بر معاملات را در اختیار شما قرار می‌دهد.

### ✨ ویژگی‌های کلیدی

* **داشبورد زنده**: مشاهده زنده معاملات باز با جزئیات کامل.
* **مدیریت دستی پیشرفته**:

  * بستن سریع معاملات (تکی، همه، سودده، ضررده)
  * ریسک‌فری کردن با یک کلیک
  * بازگرداندن حد ضرر به نقطه سر به سر
* **مدیریت خودکار معاملات (ATM)**: تعریف قوانین برای اجرای خودکار استراتژی‌ها (مثل بستن بخشی از معامله پس از رسیدن به درصدی از سود).
* **چرخه بازخورد دقیق**: دریافت نوتیفیکیشن از وضعیت اجرای دستورات (موفق یا ناموفق).
* **رابط کاربری مدرن**: طراحی زیبا با پشتیبانی از حالت روشن و تیره.
* **معماری پایدار**: حفظ صف دستورات حتی پس از بستن و باز کردن برنامه.

### 🏗️ معماری سیستم

GriffinATM از یک معماری سه‌لایه تشکیل شده است:

1. **رابط کاربری (Client)**: برنامه دسکتاپ با React و Electron
2. **سرور میانی (Broker)**: Node.js/Express داخل Electron
3. **اکسپرت (Engine)**: Expert Advisor روی نمودار MT5 نوشته‌شده با MQL5

### ⚠️ هشدار ریسک

این نرم‌افزار یک ابزار مدیریت است، نه سیگنال معاملاتی. استفاده از آن در بازارهای واقعی بدون تست کافی در حساب دمو می‌تواند منجر به زیان شود.
**قبل از استفاده در حساب واقعی، تست کامل در حساب دمو الزامی است.**

### 📄 لایسنس

تحت مجوز **GNU GPL v3.0** منتشر شده است. برای اطلاعات بیشتر فایل LICENSE را مطالعه فرمایید.

### 🤝 مشارکت

مشارکت در توسعه، گزارش باگ یا ارائه پیشنهاد از طریق بخش Issues در مخزن GitHub بسیار ارزشمند است.

---

##  English

**GriffinATM** is a powerful and modern trade manager for MetaTrader 5, built to combine a fast, responsive UI with the robust MQL5 trading engine. It empowers traders with precise manual and automated control over their positions.

### ✨ Key Features

* **Live Dashboard**: Real-time view of all open trades with full details.
* **Advanced Manual Controls**:

  * Close trades instantly (single, all, profitable, or losing)
  * One-click breakeven
  * Restore original stop-loss levels
* **Automated Trade Management (ATM)**: Set rules to automatically manage trades (e.g., partial close at profit %, set breakeven, etc.)
* **Real-Time Feedback Loop**: Notifications for successful or failed order executions.
* **Modern UI**: Beautiful, theme-switchable interface (Light/Dark).
* **Persistent Architecture**: Commands queue stays intact across app sessions.

### 🏗️ System Architecture

GriffinATM uses a robust three-layer design:

1. **Client**: Desktop app built with React + Electron
2. **Broker**: Internal Node.js/Express server inside Electron
3. **Engine**: MQL5 Expert Advisor running on an MT5 chart

### ⚠️ Risk Warning

This software is a trade manager—not a signal provider. Trading in financial markets involves risk.
**Always test the tool extensively in a demo account before using it in a live environment.**

### 📄 License

Released under **GNU General Public License v3.0**. See the LICENSE file for full details.

### 🤝 Contribution

Bug reports, feature requests, and contributions are welcome via the GitHub Issues section.

---