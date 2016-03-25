# Work-Samples-NodeJS

This directory contains the following sample work:

1. File named: "WorkOrderNewComments.js"

Description:  This is a backend NodeJS snippet that is utilizing the async-waterfall package.  This snippet gets
called from the workflow engine, and does the following:

  query() function - tries to retrieve from Mongo a workorder document.  If it can't find one it logs the error and exists.
  If it CAN find the workorder document then it passes it on to the sendEmail function.

  sendEmail() function - This retrieves email information (to, cc. etc. ) in addition to the last comment applied to this workorder
  and attempts to send a notification email out to the recipient. Again, if it fails, it handles the logging of that error, else
  it completes and finishes successfully.

  The sendEmail() function also gets the lastcomment "date", which is stored in UTC on the server, and instantiates and formats
  the date/time using the moment 3rd party lib.
  
-Troy Schumaker
