module.exports = (function () {
    var Notifications = require("../Notifications");
    var async         = require("async");
    var moment        = require("moment-timezone");

    return {
        create: function () {
            return new Object({
                processWorkflow: function (wf, item, callback) {
                    var models = this.app.models;

                    async.waterfall([
                        function query(callback) {
                            models.WorkOrder.loadOne({
                                where:   {_id: item.mongoId},
                            }, function (error, workorder) {
                                if (workorder) callback(null, workorder);
                                else callback({msg: "No workorder found with id " + item.mongoId});
                            });
                        },

                        function sendEmail(workorder, callback) {
                            var to = models.WorkOrder.resolveNotificationEmail(workorder);
                            var cc = models.WorkOrder.resolveNotificationCCEmail(workorder);
                            var tz = models.WorkOrder.resolveTimeZone(workorder)
                            if (tz == null) {
                                tz = "US/EASTERN";  // defaulting to eastern time zone
                            }                
                            
                            var lastComment = workorder.comments.slice(-1)[0];
                            console.log("WorkorderNewComments::checking last comment for workorder#: " + workorder._id);                            
                            if ( lastComment ) { 
                                lastComment.formattedDate = moment(lastComment.date).tz(tz).format("MMM Do YYYY, h:mm a"); // user's time zone
                            }

                            workorder.lastcomment = lastComment;

                            // Add in the well-defined URL to the job...
                            var aSystem        = wf.config.systemInfo;
                            workorder.urlToJob = aSystem.contractorPortal + "/jobdetail/" + workorder._id;

                            var data = {
                                workorder: workorder,
                                user:      workorder.assignedUser,
                                company:   workorder.assignedCompany,
                                comment:   item.jsonData && item.jsonData.comment ? item.jsonData.comment : "No comment",
                                system:    wf.config.systemInfo
                            };

                            Notifications.sendEmailNotification("workorder_new_comments_email_to_contractor", to, cc, tz, data, function (error, status) {
                                if (error) {
                                    console.log("WorkOrderNewcomments::error in sendEmailNotification, it was: " + error);
                                    callback({msg: "WorkOrderNewcomments::error in sendEmailNotification, it was: " + error});                                    
                                }

                                callback(null, workorder);
                            });
                        }
                    ], function (error, workorder) {
                        callback(error)
                    });
                }
            });
        }
    };
})();
