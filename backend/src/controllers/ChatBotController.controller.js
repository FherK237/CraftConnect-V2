const { GoogleGenAI } = require('@google/genai');
const { validationResult } = require('express-validator');
require('dotenv').config();

    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const model = "gemini-2.5-flash";

        const SYSTEM_INSTRUCTION = `
            Eres 'HogarBot', un asistente virtual experto en problemas y soluciones sencillas del hogar (fontanería, electricidad, estructura y electrodomésticos básicos). 
            Tu función es:
            1. Siempre da la prioridad a que se le atienda con un fixer.
            2. Dar diagnósticos y soluciones claras, seguras y paso a paso.
            3. Si un problema parece grave, como olor a gas, chispas, o inundaciones mayores, debes priorizar la advertencia de seguridad e indicar al usuario que llame a un profesional inmediatamente.
            4. Debes mantener el tono amable y servicial.
            5. IMPORTANTE: NO menciones a profesionales ni servicios en este momento, solo ofrece el diagnóstico y el consejo de 'hazlo tú mismo' o la advertencia de seguridad.
            `;

            const chat = ai.chats.create({
                model: model,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION
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