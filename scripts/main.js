import {MODULE_ID, VERSION} from "./config.js";
import {RoarEngine} from "./engine.js";
import {registerSettings, debug, setting} from "./settings/settings.js";
import {registerSocket} from "./socket/socket.js";
import {RoarImpactApp} from "./ui/roar-app.js";

let engine; let app;
Hooks.once("init",()=>{registerSettings();console.info(`Roar Impact | v${VERSION} initialized`);});
Hooks.once("ready",async()=>{
  try{engine=new RoarEngine();await engine.initialize();registerSocket(engine);game.modules.get(MODULE_ID).api={open:openPanel,play:(options={})=>playFromApi(options),profiles:engine.profiles};debug("ready",[...engine.profileIds]);}
  catch(error){console.error("Roar Impact | Initialization failed",error);ui.notifications.error(game.i18n.localize("ROAR.Errors.Init"));}
});
Hooks.on("getSceneControlButtons",controls=>{
  if(!game.user.isGM||!controls.tokens)return;
  controls.tokens.tools.roarImpact={name:"roarImpact",title:"ROAR.Controls.Open",icon:"fa-solid fa-dragon",order:Object.keys(controls.tokens.tools).length,button:true,visible:true,onChange:()=>openPanel()};
});
Hooks.on("canvasTearDown",()=>engine?.cleanupAll());
Hooks.on("destroyToken",token=>{if(engine?.active.size)debug("Source token destroyed",token.id);});

function openPanel(){if(!engine)return;app??=new RoarImpactApp(engine);app.render({force:true});}
async function playFromApi(options){
  if(!game.user.isGM)throw new Error("Only a GM may broadcast Roar Impact events.");
  const source=options.token??canvas.tokens?.controlled?.[0];if(!source)throw new Error("A source token is required.");
  return engine.broadcast(source,{profileId:options.profileId??"colossal-dragon",intensity:options.intensity??1,radius:options.radius??setting("defaultRadius"),quality:options.quality??setting("defaultQuality"),mainVolume:options.mainVolume??1,depthVolume:options.depthVolume??1,audio:options.audio!==false,vfx:options.vfx!==false,shake:options.shake!==false,randomize:options.randomize!==false});
}
