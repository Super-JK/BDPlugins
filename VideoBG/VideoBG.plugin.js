/**
 * @name VideoBG
 * @website https://github.com/Super-JK/BDPlugins/VideoBG
 * @source https://raw.githubusercontent.com/Super-JK/BDPlugins/master/VideoBG/VideoBG.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"main":"index.js","info":{"name":"videoBG","authors":[{"name":"Super_JK","discord_id":"282818386348736534","github_username":"Super-JK"}],"version":"0.1","description":"Add a video in the background","github":"https://github.com/Super-JK/BDPlugins/VideoBG","github_raw":"https://raw.githubusercontent.com/Super-JK/BDPlugins/master/VideoBG/VideoBG.plugin.js"},"changelog":[{"title":"New Stuff","items":["Initial release"]}],"defaultConfig":[]};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const css = `.videoBG {
  position: fixed;
  right: 0;
  width: 100%; 
}`;
    const videoBGHTML = `<video autoplay muted loop class="videoBG"> 
    <source src="$src" type="video/mp4" > 
</video>`
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
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/