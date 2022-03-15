import { lighten } from "@/utils/color";

const themeColor = "#39d353";
/** 获取贡献强度颜色 */
export function getContributionIntensityColor(number: number): string {
    let color = "";
    switch (true) {
        case number == 0:
            color = "#E4E7ED";
            break;
        case number > 0 && number <= 10:
            color = lighten(themeColor, 60);
            break;
        case number > 10 && number <= 50:
            color = lighten(themeColor, 40);
            break;
        case number > 50 && number <= 100:
            color = lighten(themeColor, 20);
            break;
        case number > 100:
            color = lighten(themeColor, 0);
            break;
    }
    return color;
}