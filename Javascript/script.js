const ImagesWrapper = document.querySelector(".images"),
LoadMoreBtn = document.querySelector(".load-more"),
Searchinput = document.querySelector(".search-box input"),
LightBox = document.querySelector(".light-box"),
CloseBtn = LightBox.querySelector(".uil-times"),
DownloadImgBtn = LightBox.querySelector(".uil-import");

let ApiKey = "AdxeLU9KrbEx1Fp9jvO8DnwBoXrbc8otXMjih9nu6Tu5fzrKS5DU19UH",
PerPage = 15,
CurrentPage = 1,
SearchTerm = null; 


const DownloadImg =(ImgUrl)=>{
fetch(ImgUrl).then(res => res.blob()).then(file => {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();

}).catch(()=> alert("Failed to download image!"));
}

function ShowLightBox(name,img) {
    LightBox.querySelector("span").innerText = name;
    LightBox.querySelector("img").src = img;
    LightBox.classList.add("show");
    DownloadImgBtn.setAttribute("data-img", img);
    document.body.style.overflow = "hidden";
}

function HideLightBox (){
    LightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const GenerateHtml = (images) => {
    ImagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="ShowLightBox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="Img-1">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick ="DownloadImg('${img.src.large2x}')")><i class="uil uil-import"></i></button>
            </div> 
    </li>`
    ).join("");
    
}

const GetImage = (ApiUrl) =>{
    LoadMoreBtn.innerText = "Loading...";
    LoadMoreBtn.classList.add("disabled");
    fetch(ApiUrl, {
        headers : {Authorization: ApiKey}
    }).then(res => res.json()).then(data =>{
        GenerateHtml(data.photos);
        LoadMoreBtn.innerText = "Load More";
        LoadMoreBtn.classList.remove("disabled");
    }).catch(()=> alert("Failed to load please try again"));
}

const LoadMoreImages = () =>{
    CurrentPage++;
    let ApiUrl = `https://api.pexels.com/v1/curated?page=${CurrentPage}&per_page=${PerPage}`;
    ApiUrl = SearchTerm ? `https://api.pexels.com/v1/search?query=${SearchTerm}&page=${CurrentPage}&per_page=${PerPage}` : ApiUrl;
    GetImage(ApiUrl);
}
const LoardSearchedImages = (e) => {
    if(e.target.value === "") return SearchTerm = null;

    if(e.key == "Enter"){
        CurrentPage = 1 ;
        SearchTerm = e.target.value;
        ImagesWrapper.innerHTML = "";
        GetImage(`https://api.pexels.com/v1/search?query=${SearchTerm}&page=${CurrentPage}&per_page=${PerPage}`);
    }
}

GetImage(`https://api.pexels.com/v1/curated?page=${CurrentPage}&per_page=${PerPage}`);

LoadMoreBtn.addEventListener("click", LoadMoreImages);

Searchinput.addEventListener("keyup", LoardSearchedImages);

CloseBtn.addEventListener("click", HideLightBox);

DownloadImgBtn.addEventListener("click", (e) => DownloadImg(e.target.dataset.img));

