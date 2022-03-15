import { InstanceTool } from "com_utils/InstanceTool";
import anime from "animejs/lib/anime.js";
import { Env } from "@/_d/Env";
import { EEasing } from "@/_d/EEasing";
let loadingEl: HTMLDivElement;
let imgEl: HTMLImageElement;
let spanEl: HTMLSpanElement;
if (Env.ifC) {
    loadingEl = document.getElementById('loading')! as HTMLDivElement;
    imgEl = loadingEl.querySelector('img')!;
    spanEl = loadingEl.querySelector('span')!;
}

/**
 * 首屏工具
 */
@InstanceTool()
export class FSTool {
    /** 单例 */
    static instance: FSTool;

    /** 是否隐藏过了，避免重复隐藏导致报错 */
    private ifHide = false;

    /**
     * 隐藏首屏
     */
    hide(el: HTMLImageElement = imgEl) {
        if (Env.ifS || this.ifHide) {
            return Promise.resolve();
        }
        this.ifHide = true;
        spanEl.remove();
        return new Promise<void>((r) => {
            let time = 0;
            let imgRect = imgEl.getBoundingClientRect();
            let newImgRect = el.getBoundingClientRect();
            imgEl.src = el.src;
            document.body.appendChild(imgEl);
            imgEl.classList.add('separation');
            imgEl.style.top = imgRect.y + 'px';
            imgEl.style.left = imgRect.x + 'px';
            anime({
                targets: loadingEl,
                duration: time,
                opacity: 0,
                easing: EEasing.linear,
                complete() {
                    document.body.removeChild(loadingEl);
                },
            });
            anime({
                targets: imgEl,
                duration: time,
                width: newImgRect.width,
                height: newImgRect.height,
                top: newImgRect.y,
                left: newImgRect.x,
                borderRadius: el.style.borderRadius || 0,
                easing: EEasing.easeInOutBack,
                complete() {
                    document.body.removeChild(imgEl);
                    r();
                },
            });
        });
    }
}