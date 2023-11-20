class SliderBall {
    baseSlider;

    obj;
    arrow;
    ring;
    bg;
    followCircle;
    sliderB;

    constructor(baseSlider) {
        this.baseSlider = baseSlider;
        this.obj = new PIXI.Container();

        const sliderFollowCircle = new PIXI.Sprite(Texture.ARGON.SLIDER_FOLLOW_CIRCLE.texture);
        const sprite = new PIXI.Sprite(Texture.ARGON.SLIDER_B.arrow.texture);
        const outerRing = new PIXI.Sprite(Texture.ARGON.SLIDER_B.ring.texture);
        const bgMask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 59).endFill();
        const bgSprite = new PIXI.Sprite(Texture.ARGON.SLIDER_B.gradient.texture);
        bgSprite.mask = bgMask;

        sliderFollowCircle.anchor.set(0.5);
        sprite.anchor.set(0.5);
        outerRing.anchor.set(0.5);
        bgSprite.anchor.set(0.5);

        outerRing.scale.set(Texture.ARGON.SLIDER_B.ring.isHD ? 0.5 : 1);

        const sliderB = new PIXI.Container();
        sliderB.addChild(bgMask);
        sliderB.addChild(bgSprite);
        sliderB.addChild(sprite);
        sliderB.addChild(outerRing);

        this.obj.addChild(sliderFollowCircle);
        this.obj.addChild(sliderB);

        this.arrow = sprite;
        this.ring = outerRing;
        this.bg = bgSprite;
        this.followCircle = sliderFollowCircle;
        this.sliderB = sliderB;
    }

    draw(timestamp) {
        const skinType = skinning.type === "0" ? "ARGON" : "LEGACY";
        const circleBaseScale = (Beatmap.moddedStats.radius / 54.4) * (skinType === "ARGON" ? 0.95 : 1);
        const sliderFollowSkinScale = Texture[skinType].SLIDER_FOLLOW_CIRCLE.isHD ? 0.25 : 0.5;

        this.followCircle.texture = Texture[skinType].SLIDER_FOLLOW_CIRCLE.texture;
        this.arrow.texture = Texture[skinType].SLIDER_B.arrow.texture;
        this.ring.texture = Texture[skinType].SLIDER_B.ring.texture;
        this.bg.texture = Texture[skinType].SLIDER_B.gradient.texture;

        this.followCircle.scale.set(sliderFollowSkinScale);
        this.ring.scale.set(Texture[skinType].SLIDER_B.ring.isHD ? 0.5 : 1);

        this.obj.alpha = 1;
        this.sliderB.alpha = 1;
        this.followCircle.alpha = 1;
        this.followCircle.scale.set(2.4 * sliderFollowSkinScale);

        if (timestamp < this.baseSlider.time || timestamp >= this.baseSlider.endTime + 200) this.obj.alpha = 0;
        if (timestamp >= this.baseSlider.time && timestamp < this.baseSlider.time + 300) {
            const alphaB = Clamp((timestamp - this.baseSlider.time) / 200, 0, 1);
            const alphaF = Clamp((timestamp - this.baseSlider.time) / 150, 0, 1);

            this.sliderB.alpha = easeOutQuint(alphaB);
            this.followCircle.alpha = easeOutQuint(alphaF);
            this.followCircle.scale.set((1.5 + alphaF * 0.9) * sliderFollowSkinScale);
        }

        this.arrow.scale.set(0.7, 0.8);

        let point = this.baseSlider.getPointAtTime(timestamp) ?? this.baseSlider.realTrackPoints.at(-1);

        if (timestamp < this.baseSlider.time) point = this.baseSlider.realTrackPoints.at(0);

        this.arrow.angle = !mods.HR ? point.angle : -point.angle;

        const currentStackOffset = Beatmap.moddedStats.stackOffset;

        let { x, y } = point;
        if (mods.HR) y = 384 - y;

        this.obj.scale.set(circleBaseScale * Game.SCALE_RATE * (236 / 256) ** 2);

        this.obj.x = (x + this.baseSlider.stackHeight * currentStackOffset) * (Game.WIDTH / 512);
        this.obj.y = (y + this.baseSlider.stackHeight * currentStackOffset) * (Game.WIDTH / 512);

        const colors = sliderAppearance.ignoreSkin ? Skinning.DEFAULT_COLORS : Beatmap.COLORS;
        const idx = this.baseSlider.colourIdx % colors.length;
        
        this.bg.tint = colors[idx];
        this.bg.angle = -this.obj.angle;

        this.followCircle.tint = 0xffffff;
        if (skinType === "ARGON") this.followCircle.tint = colors[idx];

        if (timestamp > this.baseSlider.endTime && timestamp < this.baseSlider.endTime + 200) {
            const alphaB = Clamp((timestamp - this.baseSlider.endTime) / 200, 0, 1);
            const alphaF = Clamp((timestamp - this.baseSlider.endTime) / 200, 0, 1);

            this.sliderB.alpha = 1 - easeOutQuint(alphaB);
            this.followCircle.alpha = 1 - easeOutQuint(alphaF);
            this.followCircle.scale.set((1.5 + (1 - alphaF) * 0.9) * sliderFollowSkinScale);
        }
    }
}
