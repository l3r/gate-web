/*
 *  ByteArrayURLStreamHandler.java
 *  Copyright (c) 2007-2011, The University of Sheffield.
 *
 *  This file is part of GCP (see http://gate.ac.uk/), and is free
 *  software, licenced under the GNU Affero General Public License,
 *  Version 3, November 2007.
 *
 *
 *  $Id: ByteArrayURLStreamHandler.java 1883 2016-05-10 18:43:49Z ian $
 */
package gate.web;

import java.io.*;
import java.net.*;

/**
 * This oddity is just a wrapper around a byte array and a URL, to
 * allow creation of GATE documents from a byte array with
 * application/pdf type.  Copied and simplified from GCP.
 */
public class ByteArrayURLStreamHandler
        extends URLStreamHandler   {

    private byte[] data;

    public ByteArrayURLStreamHandler(byte[] data) {
        this.data = data;
    }

    public URLConnection openConnection(URL u) {
        return new URLConnection(u) {
            public void connect() {
                // do nothing, but superclass method is abstract
            }

            public InputStream getInputStream() {
                return new ByteArrayInputStream(data);
            }

        };
    }


}
