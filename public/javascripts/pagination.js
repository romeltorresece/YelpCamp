const paginate = document.getElementById('paginate');
const campgroundsContainer = $('#campgrounds-container');
paginate.addEventListener('click', function(e) {
    e.preventDefault();
    fetch(this.href)
        .then(response => response.json())
        .then(data => {
            for (let campground of data.docs) {
                let template = generateCampground(campground);
                campgroundsContainer.append(template);
            }
            let { nextPage, hasNextPage } = data;
            if (hasNextPage) {
                this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
            } else {
                this.hidden = true;
            }
            campgrounds.features.push(...data.docs);
            map.getSource('campgrounds').setData(campgrounds);
        })
        .catch(err => console.log(err));
});

function generateCampground(campground) {
    let template = `
    <div class="card mb-3">
        <div class="row">
            <div class="col-md-4">
                <img class="img-fluid" src="${ campground.images.length ? campground.images[0].url : 'https://res.cloudinary.com/dbhv1lwyz/image/upload/v1651984641/YelpCamp/wiy0s0yweyoqnzcveziu.jpg' }" alt="">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${ campground.title }</h5>
                    <p class="card-text">${ campground.description }</p>
                    <p class="card-text">
                        <small class="text-muted">${ campground.location }</small>
                    </p>
                    <a class="btn btn-outline-dark" href="/campgrounds/${ campground._id }">View ${ campground.title }</a>
                </div>
            </div>
        </div>
    </div>`;

    return template;
}
