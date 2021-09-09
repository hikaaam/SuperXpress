import * as fs from "fs";
import * as prompt from "prompt";

const main = () => {
    prompt.get(["Delete"], (error, result) => {
        const { Delete } = result;
        fs.unlink(`src/App/Controllers/${Delete}Controller.ts`, (err) => {
            if (err) return console.log(err.message);
            console.log('controller deleted');
        });
        fs.unlink(`src/App/Validator/${Delete}/index.ts`, (err) => {
            if (err) return console.log(err.message);
            console.log('validator deleted');
            fs.rmdirSync(`src/App/Validator/${Delete}`);
        });
        fs.unlink(`src/Entity/${Delete}.ts`, (err) => {
            if (err) return console.log(err.message);
            console.log('entiry deleted');
        });
        fs.unlink(`src/App/Router/${Delete}/index.ts`, (err) => {
            if (err) return console.log(err.message);
            console.log('router deleted');
            fs.rmdirSync(`src/App/Router/${Delete}`);
        });

    });
};

main();