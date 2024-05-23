'use strict'
class Films {
    #api = {
        apikey: '9bfdd98a',
        page: 1
    }

    constructor() {
        this.wrapper = document.querySelector('.films');
        this.form = this.wrapper.children[0].children[1];
        this.message = this.wrapper.querySelector('.films_message');
        this.filmsCard = this.wrapper.querySelector('.films_items');
        this.details =  this.wrapper.querySelector('.film_details')
    }

    setApi(page){
        this.#api.page = page;
    }

    createMessage(str) {
        let html = `<h3>${str}</h3>`;
        this.message.innerHTML = '';
        this.message.insertAdjacentHTML('afterbegin', html)
    }

    createCardFilm(obj) {
        let html = `<div class="films_item">
                        <div class="fimls_poster">
                            <img src="${obj.Poster}" alt="">
                        </div>
                        <div class="films_description">
                            <p class="films_type">${obj.Type}</p>
                            <h3 class="films_title">${obj.Title}</h3>
                            <p class="films_year">${obj.Year}</p>
                            <button class="details">detalis</button>
                        </div>
                    </div>`

        this.filmsCard.insertAdjacentHTML('afterbegin', html)
        this.createMessage('Films:');

    }

    getDataForm() {
        if (this.form.querySelector('.search_title').value !== '') {
            this.#api.s = this.form.querySelector('.search_title').value;
        }

        if (this.form.querySelector('.search_type').value !== '') {
            this.#api.type = this.form.querySelector('.search_type').value;
        }


    }

    getUrlForQuery() {
        let str = 'http://www.omdbapi.com/?';

        for (let key in this.#api) {
            str = str + key + "=" + this.#api[key] + '&';
        }
        console.log(str);
        return str;     
    }
    
    getRequest(url) {
        fetch(url)
            .then(response => response.json())
            .then(response => {
                if (response.totalResults > 10) {
                    new Pagination('.pagination', response.totalResults).init();
                }
                console.log(response)
                return response
            })
            .then(response => {
                this.message.innerHTML = '';
                this.filmsCard.innerHTML = ''
                response.Search.forEach(elem => {
                    this.createCardFilm(elem);
                });
            })

            .catch(() => this.createMessage('No found movies'));

    }

    getRequestForPagonation(url) {
        fetch(url)
            .then(response => response.json())
            .then(response => {
                this.message.innerHTML = '';
                this.filmsCard.innerHTML = ''
                response.Search.forEach(elem => {
                    this.createCardFilm(elem);
                });
            })

            .catch(() => this.createMessage('No found movies'));

    }

    queryFilmsInfo(e) {
        e.preventDefault();
        this.getDataForm();
        let url = this.getUrlForQuery();

        this.getRequest(url)
    }

    getUrlForSearch() {
        let str = 'http://www.omdbapi.com/?apikey=9bfdd98a';

        str = str + '&' + 't' + '=' + this.#api.t;
    
        return str;
    } 

    getRequestForSearch(url){
        fetch(url)
        .then(response => response.json())
        .then(response => {
            this.openModal(response);
        })
    }

    getFilmsName(obj) {
        const title = obj.querySelector('.films_title').textContent;
        this.#api.t = title;
        let url = this.getUrlForSearch();
        this.getRequestForSearch(url);
    }

    openModal(obj) {
        let html = `<div class="info">
                        <h2>Film Info</h2>
                        <div class="fiml_poster">
                            <img src="${obj.Poster}" alt="">
                        </div>
                        <div class="films_description">
                            <p>Title: <span>${obj.Title}</span></p>
                            <p>Relased: <span>${obj.Released}</span></p>
                            <p>Genre: <span>${obj.Genre}</span></p>
                            <p>Country: <span>${obj.Country}</span></p>
                            <p>Director: <span>${obj.Director}</span></p>
                            <p>Writer: <span>${obj.Writer}</span></p>
                            <p>Actors: <span>${obj.Actors}</span></p>
                            <p>Awards: <span>${obj.Awards}</span></p>
                        </div>
                    </div>
                    `

        this.details.innerHTML = '';

        this.details.insertAdjacentHTML('afterbegin', html)
    }

    init() {
        this.form.addEventListener('submit', this.queryFilmsInfo.bind(this));
        this.filmsCard.addEventListener('click', (event) => {
            if (event.target.classList.contains('details')) {
                const filmCard = event.target.closest('.films_item');
                this.getFilmsName(filmCard);
            }
        });
    }
}


class Pagination {
    #elemPerPage = 10;
    #limit = 2;

    films = new Films();

    constructor(wrapper, totalResult) {
        this.wrap = document.querySelector(wrapper);
        this.totalResult = totalResult;
        this.countPage = 0;
        this.pages = [];
        this.currentPage = null;
        this.startPage = null;
        this.endPage = null;
    }
    

    setCountPage() {
        this.countPage = Math.ceil(this.totalResult / this.#elemPerPage);
    }


    setPagesArr() {
        this.pages = [];
        if(this.countPage !== 1){
        for(let i = this.startPage; i <= this.endPage; i++) {
            this.pages.push(i);
        }
    }
    }

    setStartPage(){
        if( this.currentPage - this.#limit > 1){
            this.startPage = this.currentPage - this.#limit;
        } else {
            this.startPage = 1;
        }
    }

    setEndPage(){
        if( this.currentPage - this.#limit < this.countPage){
            this.endPage = this.currentPage + this.#limit;
        } else {
            this.endPage = this.countPage;
        }
    }

    renderPaginationItems() {
        let str = `<ul class="pagination_items">
                        ${this.renderPrev()}
                        ${this.renderPaginationElements()}
                        ${this.renderNext()}
                   </ul>`;
        this.wrap.insertAdjacentHTML('afterbegin', str);
    }

    renderPaginationElements(){
        let str = ``;
        this.pages.forEach(elem => str = str + this.renderPaginationElement(elem))

        return str;
    }

    renderPaginationElement(elem){
        if(elem === this.currentPage) {
            return `<li class="pagination_item pagination_item--active">${elem}</li>`
        }
        return `<li class="pagination_item">${elem}</li>`;
        
    }

    renderPrev(){
        if(this.startPage !== 1) {
            return `<li class="pagination_item  pagination_item--prev">&lt;&lt;</li>`
        } else {
            return '';
        }
    }

    renderNext(){
        if(this.endPage !== this.countPage) {
            return `<li class="pagination_item pagination_item--next">&gt;&gt;</li>`
        } else {
            return '';
        }
    }

    addEvent(e) {
        let target = e.target;

        if(target.matches('.pagination_item') && !target.matches('.pagination_item--prev') && !target.matches('.pagination_item--next')) {
            this.render(+target.innerText)
            this.films.getDataForm();
            const url = this.films.getUrlForQuery();
            this.films.getRequestForPagonation(url);
        }

        if(target.matches('.pagination_item--prev')){
            this.render(--this.currentPage);
            this.films.getDataForm();
            const url = this.films.getUrlForQuery();
            this.films.getRequestForPagonation(url);
        }
    
        if(target.matches('.pagination_item--next')) {
            this.render(++this.currentPage);
            this.films.getDataForm();
            const url = this.films.getUrlForQuery();
            this.films.getRequestForPagonation(url);
        }
    }

    render(param){
            this.wrap.innerHTML = '';
            this.currentPage = param;
            this.setStartPage();
            this.setEndPage();
            this.setPagesArr();
            this.renderPaginationItems();
            this.films.setApi(this.currentPage);
            
    }


    init(){
        this.setCountPage();
        this.render(1);
        this.wrap.addEventListener('click', this.addEvent.bind(this));
    }
}



