/* eslint-disable no-useless-escape */
class componentUtil {

    getPosition(parent, ele, option) {
        let result = {};
        let rHorizontal = /left|center|right/,
            rVertical = /top|center|bottom/,
            rOffset = /[\+\-]\d+(\.[\d]+)?%?/,
            rPosition = /^\w+/,
            rPercent = /%$/;

        // set up option
        let options = Object.assign({}, {
            at: 'right bottom',
            my: 'right top',
            collision: 'flipfit flip',
            of: parent
        }, option)

        let offset = parent.getBoundingClientRect();

        let targetWidth = offset.width,
            targetHeight = offset.height,
            targetOffset = {
                left: offset.left,
                top: offset.top
            },
            within = this.getWithinInfo(options.within),
            scrollInto = this.getScrollInfo(within),
            basePosition = Object.assign({}, targetOffset),
            collision = (options.collision || 'flip').split(' '),
            offsets = {};

        ['my', 'at'].forEach(po => {
            var pos = (options[po] || '').split(' '),
                horizontalOffset,
                verticalOffset;

            if (pos.length === 1) {
                pos = rHorizontal.test(pos[0]) ? pos.concat(['center']) : rVertical.test(pos[0]) ? ['center'].concat(pos) : ['center', 'center'];
            }

            pos[0] = rHorizontal.test(pos[0]) ? pos[0] : 'center';
            pos[1] = rVertical.test(pos[1]) ? pos[1] : 'center';

            // tính toán offsets

            horizontalOffset = rOffset.exec(pos[0]);
            verticalOffset = rOffset.exec(pos[1]);

            offsets[po] = [
                horizontalOffset ? horizontalOffset[0] : 0,
                verticalOffset ? verticalOffset[0] : 0
            ];

            options[po] = [rPosition.exec(pos[0])[0], rPosition.exec(pos[1])[0]];
        });

        if (options.at[0] === 'right') {
            basePosition.left += targetWidth;
        } else if (options.at[0] === 'center') {
            basePosition.left += targetWidth / 2;
        }

        if (options.at[1] === 'bottom') {
            basePosition.top += targetHeight;
        } else if (options.at[1] === 'center') {
            basePosition.top += targetHeight / 2;
        }


        // Lấy offset của component
        let getOffsets = (offsets, width, height) => {
            return [
                parseFloat(offsets[0]) * (rPercent.test(offsets[0]) ? width / 100 : 1),
                parseFloat(offsets[1]) * (rPercent.test(offsets[1]) ? height / 100 : 1)
            ]
        }

        // Lấy giá trị css
        let parseCss = (element, property) => {
            return parseInt(element.style[property]?.toString().replace('px')) || 0;
        }

        let atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
        basePosition.left += atOffset[0];
        basePosition.top += atOffset[1];


        [ele].forEach(ele => {
            let collisionPosition,
                eleOffset = ele.getBoundingClientRect(),
                eleWidth = eleOffset.width,
                eleHeight = eleOffset.height,
                marginLeft = parseCss(ele, 'marginLeft'),
                marginTop = parseCss(ele, 'marginTop'),
                position = Object.assign({}, basePosition),
                collisionWidth = eleWidth + marginLeft + parseCss(ele, 'marginRight') + scrollInto.width,
                collisionHeight = eleHeight + marginTop + parseCss(ele, 'marginBottom') + scrollInto.height,
                myOffset = getOffsets(offsets.my, eleWidth, eleHeight);
            if (options.my[0] == 'right') {
                position.left -= eleWidth;
            } else if (options.my[0] === 'center') {
                position.left -= eleWidth / 2;
            }

            if (options.my[1] === 'bottom') {
                position.top -= eleHeight;
            } else if (options.my[1] === 'center') {
                position.top -= eleHeight / 2;
            }

            position.left += myOffset[0];
            position.top += myOffset[1];

            collisionPosition = {
                marginLeft,
                marginTop
            };

            // Kiểm tra vượt quá element cha
            ['left', 'top'].forEach((name, i) => {
                this.getCollision()[collision[i]][name](position, {
                    targetHeight,
                    targetWidth,
                    elemWidth: eleWidth,
                    elemHeight: eleHeight,
                    collisionPosition,
                    collisionHeight,
                    collisionWidth,
                    offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
                    my: options.my,
                    at: options.at,
                    within,
                    elem: ele
                });
                Object.assign(result, position);
            })
        });



        return result;
    }

    getWithinInfo(ele) {
        var withinElement = ele || window,
            isWindow = withinElement === window,
            isDocument = !!withinElement && withinElement.nodeType === 9,
            hasOffset = !isWindow && !isDocument;

        return {
            element: withinElement,
            isWindow,
            isDocument,
            offset: hasOffset ? {
                left: ele.offsetLeft,
                top: ele.offsetTop
            } : {
                left: 0,
                top: 0
            },
            scrollLeft: withinElement.scrollLeft || withinElement.scrollX || 0,
            scrollTop: withinElement.scrollTop || withinElement.scrollY || 0,
            width: withinElement.offsetWidth || withinElement.innerWidth || 0,
            height: withinElement.offsetHeight || withinElement.innerHeight || 0
        };
    }

    getScrollInfo(within) {
        var overflowX = within.isWindow || within.isDocument ? '' : within.element.css('overflow-x'),
            overflowY = within.isWindow || within.isDocument ? '' : within.element.css('overflow-y'),
            hasOverflowX = overflowX === 'scroll' || (overflowX === 'auto' && within.width < within.element.scrollWidth),
            hasOverflowY = overflowY === 'scroll' || (overflowY === 'auto' && within.height < within.element.scrollHeight);
        return {
            width: hasOverflowX ? within.element.scrollHeight : 0,
            height: hasOverflowY ? within.element.scrollWidth : 0
        }
    }

    getCollision() {
        let flip = {
            left: (position, data) => {
                var within = data.within,
                    withinOffset = within.offset.left + within.scrollLeft,
                    outerWidth = within.width,
                    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = collisionPosLeft - offsetLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                    myOffset = data.my[0] === 'left' ? -data.elemWidth : data.my[0] === 'right' ? data.elemWidth : 0,
                    atOffset = data.at[0] === 'left' ? -data.targetWidth : data.at[0] === 'right' ? data.targetWidth : 0,
                    offset = -2 * data.offset[0],
                    newOverRight,
                    newOverLeft;

                if (overLeft < 0) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if (newOverRight < 0 || newOverRight < Math.abs(overLeft)) {
                        position.left += myOffset + atOffset + offset;
                    }
                } else if (overRight > 0) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                    if (newOverLeft > 0 || Math.abs(newOverLeft) < overRight) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top: function (position, data) {
                var within = data.within,
                    withinOffset = within.offset.top + within.scrollTop,
                    outerHeight = within.height,
                    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = collisionPosTop - offsetTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                    top = data.my[1] === 'top',
                    myOffset = top ? -data.elemHeight : data.my[1] === 'bottom' ? data.elemHeight : 0,
                    atOffset = data.at[1] === 'top' ? data.targetHeight : data.at[1] === 'bottom' ? -data.targetHeight : 0,
                    offset = -2 * data.offset[1],
                    newOverTop,
                    newOverBottom;

                if (overTop < 0) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if (newOverBottom < 0 || newOverBottom < Math.abs(overTop)) {
                        position.top += myOffset + atOffset + offset;
                    }
                } else if (overBottom > 0) {
                    newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if (newOverTop > 0 || Math.abs(newOverTop) < overBottom) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        };

        let fit = {
            left: function (position, data) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                    outerWidth = within.width,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = withinOffset - collisionPosLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                    newOverRight;

                if (data.collisionWidth > outerWidth) {
                    if (overLeft > 0 && overRight <= 0) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight;
                    } else if (overRight > 0 && overLeft <= 0) {
                        position.left = withinOffset;
                    } else {
                        if (overLeft > overRight) {
                            position.left = withinOffset + outerWidth - data.collisionWidth;
                        } else {
                            position.left = withinOffset;
                        }
                    }
                } else if (overLeft > 0) {
                    position.left += overLeft;
                } else if (overRight > 0) {
                    position.left -= overRight;
                } else {
                    position.left = Math.abs(position.left - collisionPosLeft, position.left);
                }
            },
            top: function (position, data) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                    outerHeight = data.within.height,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = withinOffset - collisionPosTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                    newOverBottom;

                if (data.collisionHeight > outerHeight) {
                    if (overTop > 0 && overBottom <= 0) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom;
                    } else if (overBottom > 0 && overTop <= 0) {
                        position.top = withinOffset;
                    } else {
                        if (overTop > overBottom) {
                            position.top = withinOffset + outerHeight - data.collisionHeight;
                        } else {
                            position.top = withinOffset;
                        }
                    }
                } else if (overTop > 0) {
                    position.top += overTop;
                } else if (overBottom > 0) {
                    position.top -= overBottom;
                } else {
                    position.top = Math.max(position.top - collisionPosTop, position.top);
                }
            }
        };

        let flipfit = {
            left: (...args) => {
                flip.left(...args);
                fit.left(...args);
            },
            top: (...args) => {
                flip.top(...args);
                flip.top(...args);
            }
        };

        return {
            flip,
            fit,
            flipfit
        };

    }
}

export default new componentUtil();