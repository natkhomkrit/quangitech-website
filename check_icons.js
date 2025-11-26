const {
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiNodedotjs,
    SiPhp,
    SiLaravel,
    SiMysql,
    SiPostgresql,
    SiMongodb,
    SiDocker,
    SiGit,
    SiHtml5,
    SiCss3,
    SiPython,
    SiFirebase,
    SiNginx,
    SiVercel,
    SiTypescript,
    SiJavascript
} = require("react-icons/si");

const icons = {
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiNodedotjs,
    SiPhp,
    SiLaravel,
    SiMysql,
    SiPostgresql,
    SiMongodb,
    SiDocker,
    SiGit,
    SiHtml5,
    SiCss3,
    SiPython,
    SiFirebase,
    SiNginx,
    SiVercel,
    SiTypescript,
    SiJavascript
};

for (const [name, icon] of Object.entries(icons)) {
    if (!icon) {
        console.log(`${name} is undefined`);
    } else {
        console.log(`${name} is OK`);
    }
}
