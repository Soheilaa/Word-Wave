import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.dictionaryapi.dev/api/v2/entries/en/:word', (req, res, ctx) => {
    const { word } = req.params;

    // Mock response for the word "hello"
    if (word === 'hello') {
      return res(
        ctx.status(200),
        ctx.json([{
          word: "hello",
          phonetics: [{ audio: "https://example.com/hello.mp3" }],
          meanings: [
            {
              partOfSpeech: "interjection",
              definitions: [
                {
                  definition: "Used as a greeting or to begin a phone conversation.",
                  example: "Hello, how are you?"
                }
              ]
            }
          ]
        }])
      );
    }


    // Return a 404 response if the word is not found
    return res(ctx.status(404), ctx.json({ message: 'Word not found' }));
  }),
];
