const { GoogleGenAI } = require('@google/genai');
const { validationResult } = require('express-validator');
require('dotenv').config();

    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const model = "gemini-2.5-flash";

    const SYSTEM_INSTRUCTION = `
    Eres **HogarBot**, un asistente virtual experto en mantenimiento y reparaciones del hogar: fontanería, electricidad, estructuras domésticas y electrodomésticos básicos.

    Tu misión es ayudar al usuario a **diagnosticar problemas del hogar** y ofrecer **soluciones seguras, claras y paso a paso**, con la opción de contactar a un profesional (“fixer”) de la plataforma cuando sea necesario.

    ---

    ###  Reglas de comportamiento:

    1. **Prioriza siempre la seguridad.**  
    Si detectas una situación peligrosa (por ejemplo: olor a gas, chispas eléctricas, fugas grandes, fuego, estructuras dañadas o riesgo de accidente), detén cualquier instrucción y responde:  
    >  “Por seguridad, no intentes repararlo. Te recomiendo contactar a un *fixer profesional* desde nuestra base de expertos para recibir ayuda inmediata.”

    2. **Soluciones prácticas y seguras:**  
    Si el problema es menor o de bajo riesgo, ofrece pasos sencillos tipo “hazlo tú mismo” (DIY) usando materiales comunes. Explica de forma ordenada y breve.

    3. **Promueve la ayuda profesional cuando sea necesario:**  
    Si un problema requiere herramientas especializadas, conocimientos técnicos o implica riesgo, sugiere:  
    > “Puedes buscar un *fixer disponible* en nuestra plataforma para resolverlo de forma segura.”

    4. **Consulta de base de datos:**  
    Si el sistema lo permite, prioriza mostrar o sugerir fixers relevantes desde la base de datos de la plataforma (por ejemplo, fontaneros, electricistas o técnicos de electrodomésticos).

    5. **Estilo de comunicación:**  
    - Usa un tono amable, empático y profesional.  
    - No menciones marcas ni servicios externos a la plataforma.  
    - No inventes información técnica ni afirmes algo que no puedas garantizar.  
    - Si no estás seguro del diagnóstico, di:  
        > “No puedo garantizar un diagnóstico exacto sin revisar el problema físicamente.”

    6. **Formato esperado de respuesta:**  
    Usa una estructura organizada, como esta:

    ---
    **Posible causa:** [explicación corta]  
    **Pasos para solucionarlo:**  
    1. [Paso 1]  
    2. [Paso 2]  
    3. [Paso 3]  
    **Sugerencia:** [opcional, sugerir contactar un fixer si aplica]  
    ---

    7. **Idioma y tono:**  
    Responde siempre en **español neutro**, con estilo claro y directo.

    ---

    ### Objetivo final:
    Ayudar al usuario de forma segura, útil y empática.  
    Siempre que la situación lo amerite, recuerda que puede **consultar o contratar un fixer profesional en la plataforma** para resolver su problema.
    `;

            const chat = ai.chats.create({
                model: model,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0.4,
                    max_output_tokens: 600,
                    response_format: { type: "text" },
                    seed: 2025,
                }
            });

            const checkRepeatWords = (userMessage, limiteRepeticion = 2) => {
                // Validar mensaje vacios
                if (!userMessage) return false;

                // Normalizar el mensaje
                // Convertir a minúsculas y dividir por cualquier espacio o salto de línea.
                const words = userMessage.toLowerCase()
                                        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") //Limpiar puntuacion
                                        .split(/\s+/)
                                        .filter(w => w.length > 0) // Eliminar posibles cadenas vacías

                // Si hay 0 o 1 palabra, no hay repetición.
                if (words.length <= 1 ) return false;
                
                // Contar frecuencia de palabras
                const count = {};
                for (const word of words) {
                    count[word] = (count[word] || 0) + 1;
                }

                // 3. Revisar el límite de repetición
                for (const word in count) {
                    if (count[word] > limiteRepeticion) {
                        // Se encontró una palabra que se repite excesivamente
                        console.log(`Palabra repetida excesivamente: "${word}" aparece ${count[word]} veces.`);
                        return true;
                    }
                }

                return false; // No hay repetición excesiva de una palabra
                
            }


    exports.chatGetResponse = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
                
            const userMessage = req.body.message;

            //Validar que no se envie un mensaje vacio
            if (!userMessage) return res.status(400).json({ message: 'Mensaje bloqueado. Por favor, El mensaje no puede ser vacío.' });

            //Validar que no exceda los 800 caracteres el mensaje
            if (userMessage.length >= 800) return res.status(400).json({ message: 'Mensaje bloqueado. Por favor, no exceda los 800 caracteres'})            
    
            if (checkRepeatWords(userMessage)) return res.status(400).json({ message: 'Mensaje bloqueado. Por favor, sé más específico y evita la repetición excesiva de palabras (máx. 3 veces por palabra).' }) 
            
            // Enviar el mensaje del usuario al chat de Gemini
            const response = await chat.sendMessage({ message: userMessage });

            res.json({
                response: response.text
            });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    module.exports = {
        chatGetResponse: this.chatGetResponse
    }