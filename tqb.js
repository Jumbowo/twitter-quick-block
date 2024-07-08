// Icon taken from Twitter
const blockIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"><g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path></g></svg>';

let currentUser = null;

function addBlockButtons() {
  if (currentUser === null) currentUser = getCurrentUser();
  if (currentUser === null) return;

  const tweets = [...document.getElementsByTagName("article")]
    .filter((tweet) => {
      return (tweet.getAttribute("data-testid") === "tweet") && (tweet.getAttribute("twitterQuickBlock") !== "true");
    })
    // Don't add block button to own tweets
    .filter((tweet) => {
      return tweet.querySelector("div[data-testid=\"User-Name\"] a[role=\"link\"]").getAttribute("href") !== currentUser;
    });

  for (const tweet of tweets) {
    try {
      const bottomBar = tweet.querySelector("div[role=\"group\"]:last-child");

      // Copy styling of rightmost button
      const blockIconDiv = bottomBar.children[bottomBar.children.length - 1].cloneNode(true);
      blockIconDiv.querySelector("svg").outerHTML = blockIcon;

      // Class for extension custom styles
      blockIconDiv.className += " tqbBlockButton";

      // Fix attributes
      const blockIconButton = blockIconDiv.querySelector("button");
      blockIconButton.setAttribute("aria-label", "Block");
      blockIconButton.setAttribute("data-testid", "block");
      blockIconButton.removeAttribute("aria-expanded");
      blockIconButton.removeAttribute("aria-haspopup");

      blockIconButton.addEventListener("click", (event) => block(event.target));

      // Add hover animations back manually
      const hoverDiv = blockIconDiv.querySelector("div:has(+ svg)");
      hoverDiv.classList.add("tqbHoverDiv");
      hoverDiv.setAttribute("title", "Block");

      // Mark block button added
      tweet.setAttribute("twitterQuickBlock", "true");

      bottomBar.insertBefore(blockIconDiv, bottomBar.children[4]);
    } catch (error) {
      console.error("TQB error: " + error);
    }
  }
}

async function block(target) {
  try {
    const tweet = target.closest("article[twitterQuickBlock=true]");

    // Use the native block button
    tweet.querySelector("button[data-testid=\"caret\"").click();

    // Temporarily modify a Twitter div to prevent the menu from briefly flashing
    // TODO: Fix weird flash in media viewing mode
    const layers = document.querySelector("#layers");
    layers.classList.add("tqbHideOverlay");

    await new Promise((resolve) => setTimeout(resolve, 5));
    document.querySelector("div[role=\"menuitem\"][data-testid=\"block\"]").click();
    await new Promise((resolve) => setTimeout(resolve, 5));
    document.querySelector("button[data-testid=\"confirmationSheetConfirm\"]").click();

    layers.classList.remove("tqbHideOverlay");
  } catch (error) {
    console.error("Error blocking user.");
    console.error("TQB error: " + error);
  }
}

function getCurrentUser() {
  // Use the profile button's link to get the current user's tag
  try {
    const currentUser = document.querySelector("a[data-testid=\"AppTabBar_Profile_Link\"]").getAttribute("href");
    return currentUser;
  } catch (error) {
    console.error("TQB error: " + error);
    return null;
  }
}

function terminate() {
  console.error("Twitter Quick Block encountered an error and is terminating. This may be due to a Twitter update."
    + " Please check https://github.com/Jumbowo/twitter-quick-block/issues for updates.");
  observer.disconnect(); 
}

// Checks to see if extension will work properly
function checkCompatibility() {
  // TODO: Check for Twitter changing stuff
}

try {
  console.log("Loading Twitter Quick Block");
  checkCompatibility();

  const targetNode = document.querySelector("body");
  const observerConfig = { attributes: false, childList: true, subtree: true };
  const observer = new MutationObserver(addBlockButtons);

  observer.observe(targetNode, observerConfig);
} catch (error) {
  console.error("Twitter Quick Block failed to load.");
  terminate();
}

