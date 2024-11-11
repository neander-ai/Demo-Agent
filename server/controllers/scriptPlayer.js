const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });
const SCRIPTS = process.env.RRWEB_SCRIPTS_LOCATION;
const scriptPlayer = (req, res) => {
  const flowName = req.body.flow;
  const filePath = path.join(SCRIPTS, `${flowName}.json`);
  const rawDescriptionData = fs.readFileSync(filePath);
  const descriptionData = JSON.parse(rawDescriptionData);
  const scriptMetadata =
    descriptionData[Math.floor(Math.random() * descriptionData.length)];
  const scriptFolderName = scriptMetadata.script_url.split("/")[1];
  const scriptsInFolder = fs.readdirSync(path.join(SCRIPTS, scriptFolderName));
  const randomScript =
    scriptsInFolder[Math.floor(Math.random() * scriptsInFolder.length)];
  const script = fs.readFileSync(
    path.join(SCRIPTS, scriptFolderName, randomScript)
  );
  const responseData = {
    ...scriptMetadata,
    script: JSON.parse(script),
  };
  delete responseData.script_url;
  res.send(responseData);
};

const getDomSnapshot = async (_, res, next) => {
  try {
    const data = await fs.promises.readFile(
      "./../extension/flows/discountcreation/1clickingoncreatediscount.json",
      "utf-8"
    );
    const result = JSON.parse(data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting DOM Snapshot:", error);
    next(error);
  }
};

module.exports = { scriptPlayer, getDomSnapshot };
