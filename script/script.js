class ContextMenu {                                            /* создать класс */
    static copy = ''                                            /* создать статики */
    static el = ''
    static history = ''
    constructor(data) {                                      /*  создаем конструктор который принимает данные data */
        this.el = document.querySelector('.copy__file')       /* подключаем класс  copy__file к ключу*/
        this.el.oncontextmenu = (e) => this.open(e)            /* если навести курсор на copy__file и нажать на правую кнопку мыши то запускается  метод open  */
        this.ctx = document.querySelector('.context')           /* привязываем класс context к ключу*/
        this.ctx.onclick = e => this.menu(e)                     /* при клике на context запуститься метод menu */
        this.ctx.oncontextmenu = (e) => e.preventDefault()        /*  */
        window.onclick = (e) => this.close(e)                      /* если кликнуть на любое место на экране сработает мтеод close*/
    }
    menu(e) {                                                               /* метод  menu */
        const el = e.target                                           /* ссылается на обьект который мы нажали(копировать, вставить) */
        const attr = el.getAttribute('data-current')                 /* подключаемся по аттрибуту к обьекту на который нажали */
        if(attr === 'copy-folder') {                                /* если атрибут равен  copy-folder*/
            ContextMenu.copy = ContextMenu.el.outerHTML             /* статик copy  равен статику el и всем его потомкам*/
        } else if(attr === '-paste') {                                  /*  если атрибуд нажатого элемента равен paste */
            this.el.insertAdjacentHTML('beforeend', ContextMenu.copy)    /* то он вставляет статик copy в конец элемента(прямо перед закрытием статика el) */
            if(ContextMenu.history) {                            /* не смог понять зачем это нужно */
                ContextMenu.history.remove()
                ContextMenu.history = ContextMenu.copy = ''
            }
        } else if(attr === 'cut-folder') {                     /* если атрибут равен cut-folder*/
            ContextMenu.history = ContextMenu.el               /* приравниваем статик history к статику  el*/
            ContextMenu.copy = ContextMenu.el.outerHTML        /* статик copy равняем на статик el и его потомков*/
            ContextMenu.el.classList.add('op5')                /*  добавляем классу copy__file  доп класс op5*/
        } else if(attr === 'rename-folder') {                                    /* если атрибут равен rename-folder */
            const title = ContextMenu.el.querySelector('.copy__file-title')      /* создаем констант и привязываем к ней класс */
            const inner = title.innerHTML                                        /* создаем конст  который равен html-у конста title*/
            ContextMenu.history = inner                                          /* статик history равн консте inner */
            title.innerHTML = ''                                                 /*  */
            title.insertAdjacentHTML('beforeend', `<input type="text" autofocuse value="${inner.trim()}">`)   /* вставить перед закрытием элемента title инпут */
            title.querySelector('input').focuse                                  /* если нажатть на инпут то можно начать писать имя файла */
            title.addEventListener('keydown', (e) => {                           /* если мы нажмем определенную клавишу то срабуотает функция */
                if(e.keyCode === 13) {                                           /* если нажатая клавиша равна enter */
                    const val = title.querySelector('input')                     /* константа val это инпут */
                    if(val.value) title.innerHTML = val.value                    /* когда мы чтото ввели в инпут то html title-а будет равен этому значению(еще valueпревращает в обьект но походу тут он не для этого?)  */
                    else {                                                        
                        title.innerHTML = ContextMenu.history                    /* в других случаях html title будет равен пустой строке */
                        ContextMenu.history = ''                       
                    }           
                } 
            })                                    
        } else if(attr === 'create-folder') {                             /* тут вы еще не начинали делать */
            
        }
    }
    open(e) {                                                                      /* метод open */
        e.preventDefault()                                                  
        this.ctx.classList.remove('show')                                           /* удалить класс show у ключа ctx  */
        const el = e.target.classList.contains('.copy__file-item') ? e.target : e.target.closest('.copy__file-item') /* конста el если ссылаемый обьект это copy__file-item то можно продолжать а если нет  то подключиться к его родителю   */
        ContextMenu.el = el                                              /* статик el равен консте el */
        const data = {                                              /* создаем объект */                        
            folder: {                                               /* ключ и внутри еще объект */
                'cut-folder': 'Вырезать',                           /* ключи и их значения */
                'copy-folder': 'Копировать',
                'rename-folder': 'Переименовать',
                'remove-folder': 'Удалить'
            },
            file: {                                                   

            },
            null: {               
                'sistem-paste': 'Вставить',
                'create-folder': 'Создать папку',
            }
        }
        let type = 'null'                               /* создаем переменную type которая равна 0 */
        if (el) {                                       /* когда случится конста el */
            type = el.getAttribute('data-type')         /* type равен атрибуту консты el */
        } 
        this.ctx.innerHTML = ''                     /* ? */
        for (const key in data[type]) {        /* ? */
            let data_key = key                 /* ключи записываются в переменную data_key */
            if (key.match(/(sistem)/)) {         /* если в ключах найдет слово sistem*/
                data_key = key.replace(/(sistem)/, '')  /* замегить в ключе слово sistem на пустую строку */
                if (ContextMenu.copy) {                     /* если будет статик copy  */
                    const html = `<div class="context__item" data-current="${data_key}">${data[type][key]}</div>`  /* ? */
                    this.ctx.insertAdjacentHTML('beforeend', html) /* вставить перед закрытием this.ctx консту html */
                }
            } else {
                const html = `<div class="context__item" data-current="${data_key}">${data[type][key]}</div>`   /* в остальных случаях сделать тоже самое */
                this.ctx.insertAdjacentHTML('beforeend', html)
            }
        }
        this.ctx.style.top = e.clientY + 'px'                          /* где произошло событие сtx */
        this.ctx.style.left = e.clientX + 'px'                          /* координаты */
        setTimeout(() => this.ctx.classList.add('show'), 100)          /* рекурсия метода open , добавляет класс show к this.ctx */            
    }
    close() {                                    /* метод  close */
        this.ctx.classList.remove('show')        /* убрать класс show у ctx */
    }
}

new ContextMenu()                                 /* вызываем класс */