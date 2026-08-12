Set oWS = WScript.CreateObject(" "WScript.Shell)  
sLinkFile = oWS.SpecialFolders(Desktop) & \SHIRI" JANANI "HOSPITALS.lnk  
Set oLink = oWS.CreateShortcut(sLinkFile)  
oLink.TargetPath = C:\odinfotech\janani hospital software\Start-Hospital-Desktop-App.bat  
oLink.WorkingDirectory = C:\odinfotech\janani hospital software  
oLink.Description = SHIRI" JANANI HOSPITALS Desktop "Software  
oLink.IconLocation = C:\odinfotech\janani hospital software\public\desktop-icon.png  
oLink.Save  
