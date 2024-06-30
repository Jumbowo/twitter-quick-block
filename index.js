// Icon taken from Twitter
const blockIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"><g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path></g></svg>';

function addBlockButtons() {
  const tweets = [...document.getElementsByTagName("article")]
    .filter((tweet) => tweet.getAttribute("data-testid") === "tweet" && tweet.getAttribute("twitterQuickBlock") !== "true");

  for (const tweet of tweets) {
    const bottomBar = tweet.querySelector("div[role=\"group\"]:last-child");

    // Copy styling of rightmost button
    const blockIconDiv = bottomBar.children[bottomBar.children.length - 1].cloneNode(true);
    blockIconDiv.querySelector("svg").outerHTML = blockIcon;

    // Class for extension custom styles
    blockIconDiv.className += " tqbBlockButton";

    // Fix attributes
    blockIconButton = blockIconDiv.querySelector("button");
    blockIconButton.setAttribute("aria-label", "Block");
    blockIconButton.setAttribute("data-testid", "block");
    blockIconButton.removeAttribute("aria-expanded");
    blockIconButton.removeAttribute("aria-haspopup");

    blockIconButton.addEventListener("click", (event) => block(event.target));

    // Add hover animations back manually
    const hoverDiv = blockIconDiv.querySelector("div:has(+ svg)");
    hoverDiv.classList.add("tqbHoverDiv");

    // Mark block button added
    tweet.setAttribute("twitterQuickBlock", "true");
    bottomBar.insertBefore(blockIconDiv, bottomBar.children[4]);
  }
}

async function block(target) {
  const tweet = target.closest("article[twitterQuickBlock=true]");

  // Use the native block button
  tweet.querySelector("button[data-testid=\"caret\"").click();
  
  // Modify a Twitter div to prevent the menu from briefly flashing
  const layers = document.querySelector("#layers");
  layers.classList.add("tqbHideOverlay");

  await new Promise((resolve) => setTimeout(resolve, 5));
  document.querySelector("div[role=\"menuitem\"][data-testid=\"block\"]").click();
  await new Promise((resolve) => setTimeout(resolve, 5));
  document.querySelector("button[data-testid=\"confirmationSheetConfirm\"]").click();

  layers.classList.remove("tqbHideOverlay");
}

console.log("Loading Twitter Quick Block");

const targetNode = document.querySelector("body");
const observerConfig = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(addBlockButtons);
observer.observe(targetNode, observerConfig);
