const express = require('express'); 
const request = require('request'); 
const app = express(); 

const PORT = 30159; 

function fetchDogImage(callback) {
    const url = 'https://dog.ceo/api/breeds/image/random';

    request(url, { json: true }, (error, response, body) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, body.message); 
        }
    });
}

app.get('/dog', (req, res) => {
    fetchDogImage((error, dogImageUrl) => {
        if (error) {
            res.status(500).send('犬の画像を取得できませんでした。');
            return;
        }
        res.send(`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ランダムな犬の画像</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    h1 {
                        color: #333;
                    }
                    img {
                        margin-top: 20px;
                        max-width: 300px;
                        height: auto;
                        border: 2px solid #ddd;
                        border-radius: 10px;
                    }
                    button {
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #fff;
                        background-color: #007bff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <h1>ランダムな犬の画像はこちら！</h1>
                <p>学籍番号：2301330008 氏名：王　家俊</p>
                <img id="dog-image" src="${dogImageUrl}" alt="ランダムな犬の画像">
                <br>
                <button onclick="reloadImage()">画像をリロード</button>
                <script>
                    function reloadImage() {
                        fetch('/dog/image')
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('dog-image').src = data.imageUrl;
                            })
                            .catch(error => {
                                alert('画像をリロードできませんでした。');
                            });
                    }
                </script>
            </body>
            </html>
        `);
    });
});

app.get('/dog/image', (req, res) => {
    fetchDogImage((error, dogImageUrl) => {
        if (error) {
            res.status(500).json({ error: '犬の画像を取得できませんでした。' });
            return;
        }

        res.json({ imageUrl: dogImageUrl });
    });
});

app.listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});
