import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "مفتاح واجهة جيمناي (API key) غير مفعل." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // تزويد الذكاء الاصطناعي بمعلومات عن المتجر ليجيب كمساعد ذكي
    const systemInstruction = `أنت مساعد ذكي ولطيف لمتجر ملابس مميز يُدعى 'ICLOTH' (آي كلوث). 
مهمتك مساعدة العملاء والتحدث باللغة العربية باحترافية وبطريقة ودودة.
معلومات عن المتجر: الأسعار تبدأ من 100 جنيه، وهناك شحن سريع لجميع المحافظات.
لا تخرج عن سياق متجر الملابس أو الأسئلة المتعلقة بالتسوق. إذا سألك المشتري عن منتج ساعده في اتخاذ القرار.`;

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(`${systemInstruction}\n\nسؤال المستخدم: ${message}`);
    const response = result.response.text();

    return Response.json({ response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json({ error: "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." }, { status: 500 });
  }
}
