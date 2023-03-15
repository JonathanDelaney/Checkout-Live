import {Injectable} from "@angular/core";
import {ScriptStore} from "./script.store";
import {ConfigurationService} from "../../configuration/configuration.service";

declare var document: any;

@Injectable({
   providedIn: 'root'
})
export class ScriptService {

   private scripts: any = {};

   constructor(private configurationService: ConfigurationService) {
      ScriptStore.forEach((script: any) => {
         this.scripts[script.name] = {
            loaded: false,
            type: script.type,
            url: script.url
         };
      });
   }

   load(...scripts: string[]) {
      let promises: any[] = [];
      scripts.forEach((script) => promises.push(this.loadScript(script)));
      return Promise.all(promises);
   }

   loadAdyenScripts(sdkVersion: string) {
      this.scripts["adyenJS"].url = this.scripts["adyenJS"].url.split('sdk')[0] + "sdk/" + sdkVersion + "/adyen.js";
      this.scripts["adyenCSS"].url = this.scripts["adyenCSS"].url.split('sdk')[0] + "sdk/" + sdkVersion + "/adyen.css";

      // console.log(this.scripts["adyenJS"].url);
      // console.log(this.scripts["adyenCSS"].url);
      let promises: any[] = [];
      promises.push(this.loadScript("adyenJS"));
      promises.push(this.loadScript("adyenCSS"));
      return Promise.all(promises);
   }

   discardLoadedAdyenScripts() {
      this.scripts["adyenJS"].loaded = false;
      this.scripts["adyenCSS"].loaded = false;
   }

   loadScript(name: string) {
      return new Promise((resolve, reject) => {
         //resolve if already loaded
         // if (this.scripts[name].loaded) {
         //    resolve({script: name, loaded: true, status: 'Already Loaded'});
         // }
         // else if ...
         if (this.scripts[name].type === "link") {
            let script = document.createElement('link');
            script.type = 'text/css';
            script.href = this.scripts[name].url;
            script.rel = "stylesheet";
            if (script.readyState) {  //IE
               script.onreadystatechange = () => {
                  if (script.readyState === "loaded" || script.readyState === "complete") {
                     script.onreadystatechange = null;
                     this.scripts[name].loaded = true;
                     resolve({script: name, loaded: true, status: 'Loaded'});
                  }
               };
            } else {  //Others
               script.onload = () => {
                  this.scripts[name].loaded = true;
                  resolve({script: name, loaded: true, status: 'Loaded'});
               };
            }
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);
         } else {
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].url;
            if (script.readyState) {  //IE
               script.onreadystatechange = () => {
                  if (script.readyState === "loaded" || script.readyState === "complete") {
                     script.onreadystatechange = null;
                     this.scripts[name].loaded = true;
                     resolve({script: name, loaded: true, status: 'Loaded'});
                  }
               };
            } else {  //Others
               script.onload = () => {
                  this.scripts[name].loaded = true;
                  resolve({script: name, loaded: true, status: 'Loaded'});
               };
            }
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
            document.getElementsByTagName('head')[0].appendChild(script);
         }
      });
   }

   public loadSDKScript(version: string) {
      // load Adyen script for selected SDK version
      this.loadAdyenScripts(version).then(data => {
         this.configurationService.setSDKVersion = version;
      }).catch(error => console.log(error));
   }
}