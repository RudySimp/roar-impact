import {setting} from "../settings/settings.js";

const {ApplicationV2, HandlebarsApplicationMixin}=foundry.applications.api;

export class RoarImpactApp extends HandlebarsApplicationMixin(ApplicationV2){
  static DEFAULT_OPTIONS={id:"roar-impact-panel",classes:["roar-impact"],tag:"form",window:{title:"ROAR.UI.Title",icon:"fa-solid fa-dragon",resizable:false},position:{width:390,height:"auto"}};
  static PARTS={form:{template:"modules/roar-impact/templates/roar-impact.hbs"}};
  constructor(engine,options={}){super(options);this.engine=engine;}
  async _prepareContext(options){
    const context=await super._prepareContext(options);
    return {...context,profiles:[...this.engine.profiles.values()].map(p=>({id:p.id,label:game.i18n.localize(p.label)})),quality:setting("defaultQuality"),radius:setting("defaultRadius"),volume:setting("masterVolume")};
  }
  _onRender(context,options){
    super._onRender(context,options);
    this.element.querySelector("[data-action='roar']")?.addEventListener("click",event=>this.#roar(event));
  }
  async #roar(event){
    event.preventDefault();
    if(!game.user.isGM)return ui.notifications.warn(game.i18n.localize("ROAR.Errors.GMOnly"));
    const selected=canvas.tokens?.controlled??[];
    if(selected.length!==1)return ui.notifications.warn(game.i18n.localize(selected.length?"ROAR.Errors.OneToken":"ROAR.Errors.NoToken"));
    const data=new FormData(this.element);
    const options={profileId:data.get("profile"),intensity:Number(data.get("intensity")),radius:Number(data.get("radius")),quality:data.get("quality"),mainVolume:Number(data.get("mainVolume")),depthVolume:Number(data.get("depthVolume")),audio:data.has("audio"),vfx:data.has("vfx"),shake:data.has("shake"),randomize:data.has("randomize")};
    if(!this.engine.profiles.has(options.profileId))return ui.notifications.error(game.i18n.localize("ROAR.Errors.Profile"));
    await this.engine.broadcast(selected[0],options);
  }
}
