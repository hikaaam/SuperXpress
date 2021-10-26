import * as fs from "fs";
import * as prompt from "prompt";
import { generateController } from './ControllerTemplate';
import { generateRouter } from './RouterTemplate';
import { generateValidator } from './ValidatorTemplate';
import { generateEntity } from './EntityTemplate';
import { generateGraphqlRouter } from './GraphqlTemplate'

console.log("\x1b[34m", "what do you want to make ?");
console.log(
    "\x1b[34m",
    "\nall = a \nentity = e \ncontroller = c \nrouter = r\nvalidator = v\n"
);

const main = () => {
    prompt.get(["make"], (error, result) => {
        if (error) return printErr(error.message);
        const { make } = result;
        if (isEmpty(make)) return printErr("You can't put empty input");
        switch (make) {
            case "a":
                getPrompt("all", createAll);
                break;
            case "e":
                getPrompt("entity", createEntity);
                getPrompt("graphql", createGraphql);
                break;
            case "c":
                getPrompt("controller", createController);
                break;
            case "r":
                getPrompt("controller", createRouter);
                break;
            case "v":
                getPrompt("validator", createValidator);
                break;
            default:
                console.log("\x1b[31m", `\n😢 Error ${make} options not found`);
                break;
        }
    });
};

main();

//other functions

const printErr = (err) => {
    if (err == "canceled") return console.log("\x1b[34m", `\n\nGoodbye 😄 ~\n`);
    console.log("\x1b[31m", `\n😢 Error ${err}\n`);
};

const isEmpty = (err) => {
    if (err == null) return true;
    else if (err == "") return true;
    else return false;
};

const getPrompt = (makeName, makeFunction) => {
    try {
        console.log("\x1b[34m", `\nwhat is your ${makeName} name ?`);
        prompt.get(["name"], (error, result) => {
            if (error) return printErr(error.message);
            const { name } = result;
            if (isEmpty(name)) return printErr("You can't put empty input");
            makeFolder(makeName);
            makeFunction(capsLetter(name));
        });
    } catch (error) {
        printErr(error.message);
    }
};

const capsLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const createController = (name) => {
    console.log("\x1b[32m", `\ncreating controller. . .`);
    const fileName = `src/App/Controllers/${name}Controller.ts`;
    fs.appendFile(fileName, generateController(name), (error) => {
        if (error) return printErr(error.message);
        console.log("\x1b[32m", `\ncontroller created at ${fileName}`);
    });
};

const createRouter = (name) => {
    console.log("\x1b[32m", `\ncreating router. . .`);
    fs.mkdirSync(`src/App/Router/${name}`);
    const fileName = `src/App/Router/${name}/index.ts`;
    fs.appendFile(fileName, generateRouter(name), (error) => {
        if (error) return printErr(error.message);
        console.log("\x1b[32m", `\nRouter created at ${fileName}`);
        console.log("\x1b[1m", `\ndon't forget to use your router at src/App/Router/index.ts !!`);

    });
};

const createGraphql = (name) => {
    console.log("\x1b[32m", `\ncreating router. . .`);
    fs.mkdirSync(`src/App/GraphqlRouter/${name}Resolver`);
    const fileName = `src/App/GraphqlRouter/${name}Resolver/index.ts`;
    fs.appendFile(fileName, generateGraphqlRouter(name), (error) => {
        if (error) return printErr(error.message);
        console.log("\x1b[32m", `\nGraphqlResolver created at ${fileName}`);
        console.log("\x1b[1m", `\ndon't forget to use your GraphqlResolver at src/App/GraphqlRouter/index.ts !!`);

    });
};

const createValidator = (name) => {
    console.log("\x1b[32m", `\ncreating router. . .`);
    fs.mkdirSync(`src/App/RestValidator/${name}`);
    const fileName = `src/App/RestValidator/${name}/index.ts`;
    fs.appendFile(fileName, generateValidator(name), (error) => {
        if (error) return printErr(error.message);
        console.log("\x1b[32m", `\nValidator created at ${fileName}`);
    });
};

const createEntity = (name) => {
    console.log("\x1b[32m", `\ncreating entity. . .`);
    const fileName = `src/Entity/${name}.ts`;
    fs.appendFile(fileName, generateEntity(name), (error) => {
        if (error) return printErr(error.message);
        console.log("\x1b[32m", `\nEntity created at ${fileName}`);
    });
};

const createAll = (name) => {
    createEntity(name);
    createGraphql(name);
    createValidator(name);
    createController(name);
    createRouter(name);
};

const makeFolder = (make) => {
    try {
        if (make == "all") {
            try {
                fs.mkdirSync("src/Entity");
                fs.mkdirSync("src/App/GraphqlRouter");
            } catch (error) { }
            try {
                fs.mkdirSync("src/App/Controllers");
            } catch (error) { }
            try {
                fs.mkdirSync("src/App/Router");
            } catch (error) { }
            try {
                fs.mkdirSync("src/App/RestValidator");
            } catch (error) { }
            try {
                fs.mkdirSync("src/App/GraphqlRouter");
            } catch (error) { }
            return;
        }
        let folderName = "src/entity";
        if (make == "entity") {
            fs.mkdirSync("src/App/GraphqlRouter");
        }
        if (make == "controller") folderName = "src/App/Controllers";
        else if (make == "router") folderName = "src/App/Router";
        else if (make == "validator") folderName = "src/App/Validator";
        fs.mkdirSync(folderName);
    } catch (error) { }
};
