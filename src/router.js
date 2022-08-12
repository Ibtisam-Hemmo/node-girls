//Handlers folder with index file with all the modules exported instead of importing file by file in our ain file
//we export them in index file 
// adding mime type lib from npm package


const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const router = (req, res) => {
const endpoint = req.url;
const method = req.method;

if (endpoint === "/" && method === "GET") {
    const filePath = path.join(__dirname, "..", "public", "index.html");
    fs.readFile(filePath, (err, file) => {
    if (err) {
        res.writeHead(500);
        res.end("Server Error");
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(file);
        res.end();
    }
    });
} else if (
    endpoint.includes("main") ||
    endpoint.includes("logo1") ||
    endpoint.includes("logo2") ||
    (endpoint.includes("script") && method === "GET")
) {
    const extension = endpoint.split(".")[1];
    const mimeType = {
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    };

    const filePath = path.join(__dirname, "..", "public", endpoint);
    fs.readFile(filePath, (err, file) => {
    if (err) {
        res.writeHead(500);
        res.end("Server Error");
    } else {
        res.writeHead(200, { "Content-Type": mimeType[extension] });
        res.write(file);
        res.end();
    }
    });
} else if (endpoint === "/posts") {
    const filePath = path.join(__dirname, "posts.json");
    fs.readFile(filePath, (err, file) => {
    if (err) {
        res.writeHead(500);
        res.end("Server Error");
    } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(file);
        res.end();
    }
    });
}
//     req.on("end", () => {
//     console.log(convertedData);
//     const filePath = path.join(__dirname, "..", "src", "posts.json");
//     console.log(filePath);
//     fs.readFile(filePath, (err, file)=>{
//         if (err) {console.log(err);}else{
//             const convertedData = querystring.parse(allData);
//         }
//     })
//     fs.writeFile(filePath, JSON.stringify(convertedData), (err) => {
//         if (err) {
//         console.log(err);
//         } else console.log(convertedData);
//     });
//     console.log(convertedData);
//     res.writeHead(301, { Location: "/" });
//     res.end();
//     });
// } 
else if (endpoint === "/create-post") {
    let allData = '';

    req.on("data", (chunks) => {
    allData += chunks;
    });
// TODO: handle this
    req.on("end", () => {
    let filePath = path.join(__dirname, ".", "posts.json");
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("server error");
        } else {
            // name%12=gfg
            let content = JSON.parse(data);
            // console.log();
            // let content =querystring.parse(data);
            const searchParams = new URLSearchParams(allData);
            const cleanData = searchParams.get("post");
            res.writeHead(200, "Content-Type : application/json");

            content[Date.now()] = cleanData; //Access object using brackets
            fs.writeFile(filePath, JSON.stringify(content), (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end("server error");
                }
            });
        }
    });
    res.writeHead(301, { Location: "/" });
    res.end();
    });
} else {
    res.writeHead(404, { "content-type": "text/html" });
    res.end(`<h1>Page not Found</h1>`);
};
}
module.exports = router
