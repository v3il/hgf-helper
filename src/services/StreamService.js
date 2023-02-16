import html2canvas from "html2canvas";
import { FastAverageColor } from "fast-average-color";
import {chunk} from "lodash";

const checks = [
    {
        "x": 301,
        "y": 197,
        "hex": "#9835f1",
        "xp": 22.5130890052356,
        "yp": 26.162018592297475
    },
    {
        "x": 1014,
        "y": 192,
        "hex": "#9a34ef",
        "xp": 75.84143605086014,
        "yp": 25.49800796812749
    },
    {
        "x": 1000,
        "y": 490,
        "hex": "#9835ef",
        "xp": 74.79431563201196,
        "yp": 65.07304116865869
    },
    {
        "x": 374,
        "y": 474,
        "hex": "#9835ef",
        "xp": 27.973074046372474,
        "yp": 62.94820717131474
    }
]

function hexColorDelta(hex1, hex2) {
    // get red/green/blue int values of hex1
    var r1 = parseInt(hex1.substring(0, 2), 16);
    var g1 = parseInt(hex1.substring(2, 4), 16);
    var b1 = parseInt(hex1.substring(4, 6), 16);
    // get red/green/blue int values of hex2
    var r2 = parseInt(hex2.substring(0, 2), 16);
    var g2 = parseInt(hex2.substring(2, 4), 16);
    var b2 = parseInt(hex2.substring(4, 6), 16);
    // calculate differences between reds, greens and blues
    var r = 255 - Math.abs(r1 - r2);
    var g = 255 - Math.abs(g1 - g2);
    var b = 255 - Math.abs(b1 - b2);
    // limit differences between 0 and 1
    r /= 255;
    g /= 255;
    b /= 255;
    // 0 means opposite colors, 1 means same colors
    return (r + g + b) / 3;
}

export class StreamService {
    #containerEl;

    constructor({ containerEl }) {
        this.#containerEl = containerEl;

        document.body.addEventListener('click', (e) => {
            const ca = this.#containerEl.querySelector('canvas');

            function findPos(obj) {
                var curleft = 0, curtop = 0;

                // console.error(obj)

                if (obj.offsetParent) {
                    do {
                        curleft += obj.offsetLeft;
                        curtop += obj.offsetTop;
                    } while (obj = obj.offsetParent);
                    return { x: curleft, y: curtop };
                }

                return undefined;
            }

            if (e.target === ca) {
                const {width, height} = ca;

                var pos = findPos(ca);
                var x = e.pageX - pos.x;
                var y = e.pageY - pos.y;
                const c = ca.getContext('2d');
                var p = c.getImageData(x, y, 1, 1).data;
                var hex = "#" + ("000000" + this.#rgbToHex(p[0], p[1], p[2])).slice(-6);

                console.log({
                    x,
                    y,
                    hex,
                    xp: x / width * 100,
                    yp: y / height * 100
                });
            }



            // this.#containerEl.style.borderColor = hex;
        })

        // this.a = false;
    }

    async isBanPhase() {
        await this.#makeScreenshot();

        const canvas = this.#containerEl.querySelector('canvas');

        if (!canvas) {
            return false;
        }

        const { width, height } = canvas;

        return checks.every(({ x, xp, y, yp, hex }) => {
            const nx = Math.floor(xp * width / 100)
            const ny = Math.floor(yp * height / 100)

            // console.error(nx, x)
            // console.error(ny, y)

            var c = canvas.getContext('2d');
            var p = c.getImageData(nx, ny, 1, 1).data;
            var nhex = "#" + ("000000" + this.#rgbToHex(p[0], p[1], p[2])).slice(-6);

            console.log(hexColorDelta(nhex.slice(1), hex.slice(1)))
            console.log(hexColorDelta(nhex.slice(1), hex.slice(1)))

            return hexColorDelta(nhex.slice(1), hex.slice(1)) > 0.85;
        });
    }

    #getPlayerEl() {
        return document.querySelector(".persistent-player");
    }

    #makeScreenshot() {
        const playerEl = this.#getPlayerEl();

        // console.error(playerEl);

        if (!playerEl) {
            return;
        }

        // this.a = true

        this.#containerEl.innerHTML = '';

        return html2canvas(playerEl).then((canvas) => {
            this.#containerEl.appendChild(canvas);

            // this.#getDominantColor(canvas)

            // const fac = new FastAverageColor();
            //
            // fac.getColorAsync(canvas)
            //     .then(color => {
            //         this.#containerEl.style.borderColor = color.hex;
            //     })
            //     .catch(e => {
            //         console.log(e);
            //     });

            // function findPos(obj) {
            //     var curleft = 0, curtop = 0;
            //
            //     // console.error(obj)
            //
            //     if (obj.offsetParent) {
            //         do {
            //             curleft += obj.offsetLeft;
            //             curtop += obj.offsetTop;
            //         } while (obj = obj.offsetParent);
            //         return { x: curleft, y: curtop };
            //     }
            //
            //     return undefined;
            // }
            //
            // const {width, height} = canvas;
            //
            // checks.forEach(({ x, xp, y, yp, hex }) => {
            //     const nx = Math.floor(xp * width / 100)
            //     const ny = Math.floor(yp * height / 100)
            //
            //     console.error(nx, x)
            //     console.error(ny, y)
            //
            //     var c = canvas.getContext('2d');
            //     var p = c.getImageData(nx, ny, 1, 1).data;
            //     var nhex = "#" + ("000000" + this.#rgbToHex(p[0], p[1], p[2])).slice(-6);
            //
            //     console.log(hexColorDelta(nhex.slice(1), hex.slice(1)))
            // })
        });
    }

    // #getDominantColor(canvas) {
    //     const context = canvas.getContext('2d');
    //     const pixelsData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    //
    //     const colors = chunk(pixelsData, 3);
    //
    //     console.time('s')
    //
    //     const data = {};
    //
    //     colors.forEach(([r, g, b]) => {
    //         const hex = this.#rgbToHex(r, g, b);
    //
    //         // console.error(hex)
    //
    //         if (!data[hex]) {
    //             data[hex] = 0;
    //         }
    //
    //         data[hex]++;
    //     });
    //
    //     console.timeEnd('s')
    //
    //     console.log(data);
    // }

    #rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }
}
