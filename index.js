import {
    tweetsData as remoteTweets
} from "/data.js"
import {
    v4 as uuidv4
} from 'https://jspm.dev/uuid';

let tweetInput = document.getElementById('tweet-Input')

// Getting data from local Storage
let tweetsData = JSON.parse(localStorage.getItem('tweets')) || remoteTweets;

// Adding event listening to listens for clicks on the DOM
document.addEventListener('click', function(e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    } else if (e.target.dataset.replybtn) {
        handleReplyClickBtn(e.target.dataset.replybtn)
    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    } else if (e.target.dataset.delete) {
        handleDeleteBtn(e.target.dataset.delete)
    }

    // Setting up local Storage
    localStorage.setItem('tweets', JSON.stringify(tweetsData));
})

// handle clicks on Reply button and render reply object
function handleReplyClickBtn(tweetId) {
    let targetTweetObject = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]
    const tweetReplyInput = document.getElementById(`reply-input-${tweetId}`)
    if (tweetReplyInput.value) {
        targetTweetObject.replies.unshift({
            handle: `@Scrimba ✅`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: tweetReplyInput.value,
            uuid: uuidv4(),
        })
    }
    render()
    document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
}

// handle delete button and delete an object from local storage
function handleDeleteBtn(tweetId) {
    let targetTweetObject = tweetsData.findIndex(tweet => tweet.uuid === tweetId)

    if (targetTweetObject >= 0) {
        tweetsData.splice(targetTweetObject, 1)
        render()
    }
}

// handle tweet button to render new tweet on document
function handleTweetBtnClick() {

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba 💰`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        })
    }
    tweetInput.value = ''
    render()
}

// handle like click button to increment and decrement like count
function handleLikeClick(tweetId) {
    const targetTweetObject = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObject.isLiked) {
        targetTweetObject.likes--
    } else {
        targetTweetObject.likes++
    }

    targetTweetObject.isLiked = !targetTweetObject.isLiked
    render()
}

// handle like retweet button to increment and decrement retweet count
function handleRetweetClick(tweetId) {
    const targetTweetObject = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObject.isRetweeted) {
        targetTweetObject.retweets--
    }

    if (!targetTweetObject.isRetweeted) {
        targetTweetObject.retweets++
    }
    targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted

    render()
}

// toggle reply button on click event
function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Feed html to the DOM
function getFeedHtml() {
    let feedHtml = ``
    tweetsData.forEach(function(tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ``

        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply) {
                repliesHtml += `  
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                    </div>
                </div>`
            })
        }

        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i 
                class="fa-regular fa-comment-dots" 
                data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i 
                class="fa-solid fa-heart ${likeIconClass}" 
                data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i 
                class="fa-solid fa-retweet ${retweetIconClass}" 
                data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                <i 
                class="fa-solid fa-trash"
                data-delete="${tweet.uuid}"></i>
                </span>
            </div>
        </div>            
    </div>
</div>
<div class="hidden "id="replies-${tweet.uuid}">
        <div class='reply-container'>
            <img src="/images/scrimbalogo.png" class="logo"/>
            <textarea
                placeholder="Reply here" 
                class="comment-text-input"
                id="reply-input-${tweet.uuid}"
            ></textarea>
            <button type="button" data-replybtn="${tweet.uuid}" class="comment-btn">Send</button>
        </div>
        ${repliesHtml}
</div>
        `
    })
    return feedHtml
}

getFeedHtml()

// render Html on the DOM
function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()