// window.onload = main.initPropertiesFromDom; ---> scope of "this" in Main becomes the same as whats window.onload
window.onload = () => {
  new Main();
}