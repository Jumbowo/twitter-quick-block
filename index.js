console.log("Loading Twitter Quick Block");

// Icon taken from Twitter
const blockIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"><g><path d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"></path></g></svg>'

function addBlockButtons() {
  let tweets = [...document.getElementsByTagName("article")]
    .filter((tweet) => tweet.getAttribute("data-testid") === "tweet" && tweet.getAttribute("twitterQuickBlock") !== "true");

  console.log(tweets);

  for (const tweet of tweets) {
    const bottomBar = tweet.querySelector("div[role=\"group\"]:last-child");

    const blockIconDiv = bottomBar.children[4].cloneNode(true);
    blockIconDiv.querySelector("svg").outerHTML = blockIcon;

    blockIconDiv.className += " tqbBlockButton";

    blockIconButton = blockIconDiv.querySelector("button");
    blockIconButton.setAttribute("aria-label", "Block");
    blockIconButton.setAttribute("data-testid", "block");

    tweet.setAttribute("twitterQuickBlock", "true");
    bottomBar.insertBefore(blockIconDiv, bottomBar.children[4]);
  }
}

document.addEventListener("DOMContentLoaded", addBlockButtons);

const targetNode = document.querySelector("body");
const observerConfig = { attributes: false, childList: true, subtree: true };

const observer = new MutationObserver(addBlockButtons);
observer.observe(targetNode, observerConfig);
