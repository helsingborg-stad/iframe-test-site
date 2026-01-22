import { registerIFrameClient } from './module.js';

document.getElementsByTagName("header")[0].style.display = 'none';
registerIFrameClient("https://e-service.helsingborg.se", window);
