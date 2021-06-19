module.exports = (Plugin, Api) => {
    const css = require("styles.css");
    const videoBGHTML = require("video.html")
    const {PluginUtilities, DOMTools} = Api;
    return class VideoBG extends Plugin {
        onStart() {
            PluginUtilities.addStyle(this.getName(), css);
            if (document.querySelector("div")) this.addVideoBG(document.querySelector("div"));
        }
        
        onStop() {
            this.removeVideo()
            PluginUtilities.removeStyle(this.getName());
        }

        addVideoBG(elem) {
            this.removeVideo()
            const modified = videoBGHTML.replace('$src',this.settings["videoURL"])

            const videoBG = DOMTools.createElement(modified);
            elem.prepend(videoBG)
        }

        removeVideo(){
            const videoBG = document.querySelector(".videoBG");
            if (videoBG) videoBG.remove();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.append(this.buildSetting({
                type: "textbox",
                id: "videoURL",
                name: "Video URL",
                note: "The url link to the video",
                value: this.settings["videoURL"],
                placeholder: "https://exmample.com/video.mp4",
                onChange: value => {
                    this.settings["videoURL"] = value;
                    this.addVideoBG(document.querySelector("div"))
                }
            }));
            return panel.getElement();
        }

    };
};