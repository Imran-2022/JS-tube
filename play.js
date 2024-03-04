let short_by_view = false;

function secondsToHours(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours} hours ${minutes} minutes ${remainingSeconds} seconds`;
}


const short_by = () => {
    short_by_view = !short_by_view;
    console.log(short_by_view);
    if (short_by_view) document.getElementById("view_id").innerText = "High to Low";
    else document.getElementById("view_id").innerText = "Low to High";

    // Reload the currently displayed category
    const currentCategoryId = document.querySelector(".active-button").id;
    showTube(currentCategoryId);
}

const empty_fill = () => {
    const empty = document.getElementById("showTube");
    const P = document.createElement("p");
    P.innerText = "hahahhahh empty like my wallet";
    empty.append(P);
}

const show_Tube = (dt) => {
    console.log(dt);

    const showTube = document.getElementById("showTube");
    showTube.innerHTML = "";

    // Parse the views and sort the data based on short_by_view flag
    dt.sort((a, b) => {
        const aViews = parseViews(a.others.views);
        const bViews = parseViews(b.others.views);
        
        if (short_by_view) {
            return bViews - aViews; // High to Low
        } else {
            return aViews - bViews; // Low to High
        }
    });

    dt?.forEach(dt => {
        const { thumbnail, title, authors, others } = dt;
        const { profile_name, profile_picture, verified } = authors[0];
        const { posted_date, views } = others;
        const card = document.createElement("div");
        card.setAttribute("id", "card_id");
        card.innerHTML = `
            <div class="card-content">
                <div class="image-container">
                    <img class="image" src=${thumbnail} alt="">
                    <p class="posted-date">${posted_date ? secondsToHours(posted_date) : ""}</p>
                </div>
                <div class="details">
                    <img class="image-in" src=${profile_picture} alt="">
                    <div>
                        <p class="title">${title}</p>
                        <p>${profile_name} ${verified ? `<img class="verified" src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg" alt="img"> ` : ""}</p>
                        <p>${views} views</p>
                    </div>
                </div>
            </div>
        `;
        showTube.append(card);
    });
    

    if (dt.length == 0) {
        empty_fill();
    }
}

// Function to parse views and remove "k"
const parseViews = (views) => {
    if (views.endsWith("k")) {
        return parseFloat(views) * 1000;
    }
    return parseFloat(views);
}


const showTube = (i_d) => {
    console.log("Button clicked: ", i_d);

    const loadData = () => {
        fetch(`https://openapi.programming-hero.com/api/videos/category/${i_d}`)
            .then(res => res.json())
            .then(data => {
                show_Tube(data?.data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    loadData();
}

const showCategory = () => {
    const showWhere = document.getElementById("Category_list");

    const loadData = () => {
        fetch(`https://openapi.programming-hero.com/api/videos/categories`)
            .then(res => res.json())
            .then(data => displayData(data.data))
            .catch(error => console.error("Error fetching data:", error));
    }

    const displayData = (data) => {
        data?.forEach((category, index) => {
            const newBtn = document.createElement("button");
            newBtn.setAttribute("id", category?.category_id);
            newBtn.textContent = category?.category;
            newBtn.addEventListener("click", () => {
                showTube(category?.category_id);
                document.querySelectorAll(".active-button").forEach(btn => btn.classList.remove("active-button"));
                newBtn.classList.add("active-button");
            });
            showWhere.appendChild(newBtn);

            // Automatically click the first button
            if (index === 0) {
                newBtn.click();
            }
        });
    }

    loadData();
}

showCategory();