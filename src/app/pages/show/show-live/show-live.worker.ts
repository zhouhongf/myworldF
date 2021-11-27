/// <reference lib="webworker" />

addEventListener('message', (dataIn) => {
    const showBlogs = dataIn.data.showBlogs;
    const allContacts = dataIn.data.allContacts;
    const photoPrefix = dataIn.data.photoPrefix;
    const avatarPrefix = dataIn.data.avatarPrefix;
    const userWid = dataIn.data.userWid;
    const nickname = dataIn.data.nickname;

    const newShowBlogs = [];

    // 取出全部通讯录好友到searchContacts集合中
    const searchContacts = [];
    for (const one of allContacts) {
        for (const two of one.value) {
            searchContacts.push(two);
        }
    }

    // 处理每一个showBlog
    for (const showBlog of showBlogs) {
        const userWidInShowBlog = showBlog.userWid;
        // 为图片添加服务器路径前缀
        const showPhotosFull = [];
        if (showBlog.showPhotos && showBlog.showPhotos.length > 0) {
            for (const photo of showBlog.showPhotos) {
                showPhotosFull.push(photoPrefix + photo);
            }
        }
        // 整理showBlog中的评论内容，根据评论人和被评论人的wid, 根据当前用户的通讯录好友信息，分别增加其显示名称displayName
        const showBlogCommentsFull = [];
        const showBlogCommentsSet = showBlog.showBlogComments;
        if (showBlogCommentsSet && showBlogCommentsSet.length > 0) {
            for (const blogComment of showBlogCommentsSet) {
                const commenterWid = blogComment.commenterWid;
                const commentAtWid = blogComment.commentAtWid;

                // 设定不能自己评论自己的内容
                const commentType = blogComment.idAt.split('-')[0];
                if (commentType === 'BLOGCOMMENT' && commenterWid === commentAtWid) {
                    continue;
                }

                // 相较于从服务器返回的评论内容，通过匹配当前用户的wid和查找当前用户的通讯录好友的wid
                // 找出commenterDisplayName和commentAtDisplayName
                let commenterDisplayName;
                let commentAtDisplayName;
                // 如果评论人的wid等于当前用户的wid,则评论人显示的名称commenterDisplayName为当前用户的昵称
                // 否则，遍历当前用户所有的通讯录好友，找到wid相匹配的好友，设置显示名称commenterDisplayName
                if (commenterWid === userWid) {
                    commenterDisplayName = nickname;
                } else {
                    for (const searchContact of searchContacts) {
                        if (commenterWid === searchContact.wid) {
                            commenterDisplayName = searchContact.displayName;
                            break;
                        }
                    }
                }
                // 同样的，如果被评论人的wid等于当前用户的wid, 则被评论人显示的名称commentAtDisplayName为当前用户的昵称
                // 否则，遍历当前用户所有的通讯录好友，找到wid相匹配的好友，设置显示名称commentAtDisplayName
                if (commentAtWid === userWid) {
                    commentAtDisplayName = nickname;
                } else {
                    for (const searchContact of searchContacts) {
                        if (commentAtWid === searchContact.wid) {
                            commentAtDisplayName = searchContact.displayName;
                            break;
                        }
                    }
                }

                const obj = {
                    id: blogComment.id,
                    idAt: blogComment.idAt,
                    comment: blogComment.comment,
                    createTime: blogComment.createTime,
                    commenterWid,
                    commenterDisplayName,
                    commentAtWid,
                    commentAtDisplayName
                };
                showBlogCommentsFull.push(obj);
            }
        }
        // 按照评论先后时间排序 评论集合
        showBlogCommentsFull.sort((a, b) => {
            return a.createTime - b.createTime;
        });


        // 最后 拼接整合 整个showBlog后，再将showBlog一个一个添加进newShowBlogs集合中
        const newShowBlog = {
            idDetail: showBlog.id,
            userWid: showBlog.userWid,
            avatar: avatarPrefix + showBlog.userWid,
            displayName: '',
            content: showBlog.content,
            showPhotos: showPhotosFull,
            showBlogComments: showBlogCommentsFull
        };
        console.log('show-live.worker工作完成');
        if (userWidInShowBlog === userWid) {
            newShowBlog.displayName = nickname;
            newShowBlogs.push(newShowBlog);
        } else {
            for (const searchContact of searchContacts) {
                if (userWidInShowBlog === searchContact.wid) {
                    newShowBlog.displayName = searchContact.displayName;
                    newShowBlogs.push(newShowBlog);
                    break;
                }
            }
        }
    }

    postMessage(newShowBlogs);
});
