const postForm = document.getElementById("post-form");
const logoutBtn = document.getElementById("logout-btn");
const userInfoName = document.getElementById("userinfo-name");
let userInfo;

(async () => {
    try {
        const posts = await getPosts();
        displayPosts(posts);
        userInfo = await getUserDetails();
        userInfoName.innerText = `Hello, ${userInfo.name}`;
    } catch (error) {
        console.error("Error fetching or displaying posts:", error);
    }
})();
postForm.addEventListener("submit", addNewPost);


logoutBtn.addEventListener("click", handleLogout);

async function getPosts() {
    const token = localStorage.getItem("authToken");

    const response = await fetch("/api/posts", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        window.location.href = "/login";
        return [];
    }
}

async function getUserDetails() {
    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/userinfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    else {
        return [];
    }

}

async function addNewPost(e) {
    e.preventDefault();


    if (!postForm.checkValidity()) {
        postForm.classList.add("was-validated");
    } else {
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const token = localStorage.getItem("authToken");

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                alert("Post created successfully!");
                document.getElementById("post-form").reset();
                location.reload();
            } else {
                alert("Failed to create post.");
            }
        } catch (err) {
            console.error(`Error creating post: ${err}`);
        }
    }
}

function displayPosts(posts) {
    const postContainer = document.getElementById("posts-container");
    postContainer.innerHTML = "";

    posts.forEach(post => {
        const postCard = document.createElement("div");
        postCard.classList.add("col");
        postCard.innerHTML = `
            <div class="card">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content}</p>
              <p class="card-text"><small class="text-muted">Author: ${post.author}</small></p>
              <button class="btn btn-warning edit-btn" data-id="${post.id}">Edit</button>
              <button class="btn btn-danger delete-btn" data-id="${post.id}">Delete</button>
            </div>
          </div>
        `;
        postCard.querySelector(".edit-btn").addEventListener("click", () => editPost(post.id));
        postCard.querySelector(".delete-btn").addEventListener("click", () => deletePost(post.id));
        postContainer.appendChild(postCard);
    });
}

async function editPost(postId) {

    const post = await getPostById(postId);
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-content").value = post.content;
    const editModal = new bootstrap.Modal(document.getElementById("editPostModal"));
    editModal.show();
    const editForm = document.getElementById("edit-post-form");
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!editForm.checkValidity()) {
            editForm.classList.add("was-validated");
        } else {
            try {
                const updatedTitle = document.getElementById("edit-title").value;
                const updatedContent = document.getElementById("edit-content").value;
                const token = localStorage.getItem("authToken");

                const response = await fetch(`/api/posts/${postId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
                });

                if (response.ok) {
                    const updatedPost = await response.json();
                    alert("Post updated successfully!");
                    updatePostInView(postId, updatedTitle, updatedContent);
                    editModal.hide();
                } else {
                    alert("Error updating post");
                }
            } catch (err) {
                console.error(`Error updating post: ${err}.`);
            }
        }
    });
}

// updatea front end view of post
function updatePostInView(postId, updatedTitle, updatedContent) {
    const postsContainer = document.getElementById("posts-container");
    const postCard = postsContainer.querySelector(`.edit-btn[data-id="${postId}"]`).closest(".card");

    postCard.querySelector(".card-title").textContent = updatedTitle;
    postCard.querySelector(".card-text").textContent = updatedContent;
}

// delete a post
async function deletePost(postId) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");

    if (confirmDelete) {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            alert("Post deleted successfully");
            location.reload();
        } else {
            alert("Error deleting post");
        }
    }
}

// get individual post by postId
async function getPostById(postId) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        alert("Failed to fetch post details");
        return {};
    }
}

// logout function
function handleLogout() {
    localStorage.removeItem("authToken");
    window.location.href = "/";
}