document.querySelector("#playerContainer").addEventListener("dragover", function (e) {
    e.preventDefault();
});

document.querySelector("#playerContainer").addEventListener("drop", function (e) {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;

    const file = e.dataTransfer.files[0];
    if (!["osz", "osr"].includes(file.name.split(".").at(-1))) return;

    ScoreParser.reset();

    if (file.name.split(".").at(-1) === "osr") {
        const parser = new ScoreParser(file);
        parser.getReplayData();
        return;
    }

    document.querySelector("#close").disabled = true;
    readZip(file);
});
